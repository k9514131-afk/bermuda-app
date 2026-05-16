<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\BookingController;
use App\Http\Controllers\Api\Admin\HotelController;
use App\Http\Controllers\Api\Admin\CityController;
use App\Http\Controllers\Api\Admin\RoomTypeController;
use App\Http\Controllers\Api\PaymentSimulatorController;
use App\Models\AuditLog;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

/*
|--------------------------------------------------------------------------
| API Routes - المنظومة الملكية لبرمودا (الإصدار الاحترافي V2.0)
|--------------------------------------------------------------------------
*/

// 1. مسارات المصادقة والبيانات العامة
Route::post('/login', [AuthController::class, 'login']);
Route::post('/register', [AuthController::class, 'register']);
Route::get('/hotels', [HotelController::class, 'index']);
Route::get('/hotels/{id}', [HotelController::class, 'show']);
Route::get('/cities', [CityController::class, 'index']);

// محاكي الدفع (مسارات عامة ليتم فتحها من الهاتف)
Route::post('/payment-simulator', [PaymentSimulatorController::class, 'store']);
Route::get('/payment-simulator/{id}', [PaymentSimulatorController::class, 'show']);
Route::patch('/payment-simulator/{id}/status', [PaymentSimulatorController::class, 'updateStatus']);

// 2. المسارات المحمية (تحتاج توكن)

Route::get('/rooms', function() {
    return response()->json(\App\Models\Room::all());
});

Route::patch('/rooms/{id}/status', function($id, Request $request) {
    $room = \App\Models\Room::findOrFail($id);
    $room->update(['status' => $request->status]);
    return response()->json($room);
});

Route::post('/bookings', [BookingController::class, 'store']);
Route::middleware('auth:sanctum')->group(function () {
    
    Route::get('/profile', [AuthController::class, 'profile']);
    Route::post('/logout', [AuthController::class, 'logout']);

    // الحجوزات
    Route::get('/bookings', [BookingController::class, 'myBookings']);
    // Route::post('/bookings', [BookingController::class, 'store']);

    // إدارة الغرف (Rooms CRUD)
    
    Route::post('/rooms', function(Request $request) {
        $room = \App\Models\Room::create($request->all());
        return response()->json($room, 201);
    });

    Route::delete('/rooms/{id}', function($id) {
        \App\Models\Room::destroy($id);
        return response()->json(['message' => 'Room deleted']);
    });

    // البطاقات المحفوظة (Saved Cards)
    Route::get('/saved-cards', function() {
        return response()->json(\App\Models\SavedCard::where('user_id', Auth::id())->get());
    });
    
    Route::post('/saved-cards', function(Request $request) {
        $card = \App\Models\SavedCard::create(array_merge($request->all(), ['user_id' => Auth::id()]));
        return response()->json($card, 201);
    });
    
    Route::delete('/saved-cards/{id}', function(string $id) {
        \App\Models\SavedCard::where('id', $id)->where('user_id', Auth::id())->delete();
        return response()->json(['message' => 'Card removed']);
    });

    // سجل التدقيق (Audit Logs)
    Route::get('/audit-logs', function() {
        return response()->json(AuditLog::latest()->get());
    });
    
    Route::post('/audit-logs', function(Request $request) {
        $log = AuditLog::create([
            'user_id' => Auth::id(),
            'event' => $request->input('action'),
            'details' => $request->input('details'),
            'ip_address' => $request->ip()
        ]);
        return response()->json($log, 201);
    });

    // إدارة الغرف - التحديث
    Route::put('/rooms/{id}', function($id, Request $request) {
        $room = \App\Models\Room::findOrFail($id);
        $room->update($request->all());
        return response()->json($room);
    });

    // الإشعارات (Notifications)
    Route::get('/notifications', function() {
        return response()->json(\App\Models\Notification::where('user_id', Auth::id())->latest()->get());
    });
    
    Route::post('/notifications', function(Request $request) {
        $notif = \App\Models\Notification::create(array_merge($request->all(), ['user_id' => Auth::id()]));
        return response()->json($notif, 201);
    });
    
    Route::delete('/notifications', function() {
        \App\Models\Notification::where('user_id', Auth::id())->delete();
        return response()->json(['message' => 'Notifications cleared']);
    });
});