<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\City;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class CityController extends Controller
{
    /**
     * عرض كافة المدن المعتمدة (الـ 13 مدينة)
     */
    public function index()
    {
        return response()->json(City::withCount('hotels')->get());
    }

    /**
     * إضافة مدينة جديدة
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name_ar' => 'required|string|unique:cities',
            'name_en' => 'required|string|unique:cities',
        ]);

        $city = City::create([
            'name_ar' => $request->name_ar,
            'name_en' => $request->name_en,
            'slug' => Str::slug($request->name_en),
        ]);

        return response()->json(['message' => 'تم إضافة المدينة بنجاح ملوكي', 'city' => $city], 201);
    }

    /**
     * تحديث بيانات مدينة
     */
    public function update(Request $request, $id)
    {
        $city = City::findOrFail($id);
        $city->update($request->only(['name_ar', 'name_en', 'status']));
        return response()->json(['message' => 'تم تحديث بيانات المدينة']);
    }

    /**
     * حذف مدينة (مع الحذر من الفنادق المرتبطة)
     */
    public function destroy($id)
    {
        $city = City::findOrFail($id);
        if ($city->hotels()->exists()) {
            return response()->json(['message' => 'لا يمكن حذف مدينة تحتوي على فنادق نشطة'], 422);
        }
        $city->delete();
        return response()->json(['message' => 'تم حذف المدينة بنجاح']);
    }
}
