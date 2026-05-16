<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Carbon\Carbon;

/**
 * @class AuthController
 * مسؤول عن بوابات الدخول والتسجيل لمنظومة برمودا الملكية
 */
class AuthController extends Controller
{
    /**
     * تسجيل حساب عميل جديد
     */
    public function register(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'identity' => 'required|string|unique:users,national_id',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|string|min:6',
            'role' => 'nullable|in:customer,staff'
        ]);

        if ($validator->fails()) {
            return response()->json(['message' => 'بيانات غير صالحة', 'errors' => $validator->errors()], 422);
        }

        $role = $request->role ?? 'customer';
        $status = 'active'; // تفعيل تلقائي لجميع الحسابات الجديدة

        $user = User::create([
            'name' => $request->name,
            'national_id' => $request->identity,
            'email' => $request->email,
            'phone' => $request->phone,
            'password' => Hash::make($request->password),
            'role' => $role,
            'status' => $status,
            'nationality' => $request->nationality,
            'gender' => $request->gender,
            'marital_status' => $request->marital_status,
        ]);

        return response()->json([
            'message' => 'تم إنشاء الحساب بنجاح في منظومة برمودا الملكية',
            'user' => $user,
            'status' => $status
        ], 201);
    }

    /**
     * تسجيل الدخول الموحد لبرمودا
     */
    public function login(Request $request)
    {
    $request->validate([
        'password' => 'required'
    ]);

    $credential = $request->credential ?? $request->username ?? $request->email ?? $request->national_id;

    if (!$credential) {
        return response()->json(['message' => 'يرجى إدخال اسم المستخدم أو البريد الإلكتروني.'], 422);
    }

    $user = User::where('national_id', $credential)
                ->orWhere('email', $credential)
                ->orWhere('username', $credential)
                ->first();

    if (!$user || !Hash::check($request->password, $user->password)) {
        return response()->json(['message' => 'عذراً، بيانات الدخول غير صحيحة ملوكي.'], 401);
    }

        if ($user->role === 'staff' && $user->status === 'pending') {
            $diff = Carbon::parse($user->created_at)->diffInMinutes(now());
            if ($diff < 2) {
                return response()->json([
                    'message' => 'حسابك قيد المراجعة الإدارية في برمودا، يرجى المحاولة بعد قليل.',
                    'status' => 'pending'
                ], 403);
            }
            $user->update(['status' => 'active']);
        }

        if ($user->status === 'suspended') {
            return response()->json(['message' => 'هذا الحساب موقوف حالياً من قِبل إدارة برمودا'], 403);
        }

        $token = $user->createToken('bermuda_auth_token')->plainTextToken;

        return response()->json([
            'user' => $user,
            'access_token' => $token,
            'message' => 'تم الدخول لمنظومة برمودا بنجاح'
        ]);
    }

    public function profile(Request $request)
    {
        return response()->json($request->user());
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();
        return response()->json(['message' => 'تم تسجيل الخروج من برمودا بنجاح']);
    }
}