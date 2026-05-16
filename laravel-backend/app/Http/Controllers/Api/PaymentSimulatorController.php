<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\PaymentSimulation;
use Illuminate\Http\Request;

class PaymentSimulatorController extends Controller
{
    /**
     * إنشاء طلب دفع جديد
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'customer_name' => 'required|string',
            'amount' => 'required|numeric',
            'temp_reference' => 'required|string',
            'payload' => 'required|array'
        ]);

        $sim = PaymentSimulation::create($validated);

        return response()->json($sim, 201);
    }

    /**
     * جلب حالة الطلب
     */
    public function show($id)
    {
        $sim = PaymentSimulation::findOrFail($id);
        return response()->json($sim);
    }

    /**
     * تحديث حالة الطلب من الهاتف
     */
    public function updateStatus(Request $request, $id)
    {
        $sim = PaymentSimulation::findOrFail($id);
        
        $request->validate([
            'status' => 'required|in:approved,rejected'
        ]);
        
        $sim->update(['status' => $request->status]);
        
        return response()->json([
            'message' => 'تم تحديث حالة العملية بنجاح ملوكي',
            'status' => $sim->status
        ]);
    }
}