<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use App\Models\BookingGuest;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

/**
 * @class BookingController
 * العقل المدبر لعمليات الحجز في منظومة برمودا الملكية
 */
class BookingController extends Controller
{
    /**
     * إنشاء حجز جديد وحفظ المرافقين
     * يطبق نظام الـ Transaction لضمان سلامة البيانات ومنع الحجز المزدوج
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'hotel_id' => 'required',
            'room_id' => 'required',
            'check_in' => 'required|date',
            'check_out' => 'required|date',
            'total_price' => 'required|numeric',
        ]);

        return DB::transaction(function() use ($request) {
            // منع الحجز المزدوج (Conflict Prevention)
            // فحص تداخل التواريخ لنفس الغرفة في قاعدة البيانات
            $overlap = Booking::where('room_id', $request->room_physical_id ?? $request->room_id)
                ->where('status', 'Active')
                ->where(function($query) use ($request) {
                    $query->whereBetween('check_in', [$request->check_in, $request->check_out])
                          ->orWhereBetween('check_out', [$request->check_in, $request->check_out]);
                })->exists();

            if ($overlap) {
                return response()->json(['message' => 'هذه الوحدة محجوزة بالفعل في هذا التاريخ'], 422);
            }

            // إنشاء سجل الحجز الرئيسي
            $booking = Booking::create([
                'user_id' => auth()->id() ?? 1,
                'hotel_id' => $request->hotel_id,
                'room_id' => $request->room_physical_id ?? $request->room_id,
                'check_in' => $request->check_in,
                'check_out' => $request->check_out,
                'total_price' => $request->total_price,
                'reference_no' => $request->id ?? 'BER-' . strtoupper(Str::random(8)), // تغيير البادئة إلى BER
                'status' => $request->status ?? 'Active',
                'payment_status' => $request->isPaid ? 'paid' : 'unpaid'
            ]);

            // حفظ بيانات المرافقين (Companions) في الجدول المرتبط
            if ($request->has('companions') && is_array($request->companions)) {
                foreach ($request->companions as $comp) {
                    BookingGuest::create([
                        'booking_id' => $booking->id,
                        'full_name' => $comp['name'] ?? 'Guest',
                        'identity_no' => $comp['identity'] ?? $comp['idNumber'] ?? '---',
                        'guest_type' => $comp['ageType'] ?? 'adult',
                        'age' => $comp['age'] ?? null,
                        'gender' => $comp['gender'] ?? 'male'
                    ]);
                }
            }

            return response()->json($booking, 201);
        });
    }

    /**
     * جلب حجوزات المستخدم الحالي
     * الموظف يرى الكل، العميل يرى حجوزاته فقط
     */
    public function myBookings()
    {
        $user = auth()->user();
        
        if ($user->role === 'staff') {
            return Booking::with(['hotel', 'room', 'guests'])->latest()->get();
        }

        return Booking::with(['hotel', 'room', 'guests'])
            ->where('user_id', $user->id)
            ->latest()
            ->get();
    }
}
