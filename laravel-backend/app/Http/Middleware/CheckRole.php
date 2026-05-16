<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;

class CheckRole
{
    /**
     * التحقق من دور المستخدم قبل السماح له بالمرور
     * 
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure  $next
     * @param  string[]  ...$roles
     */
    public function handle(Request $request, Closure $next, ...$roles)
    {
        if (!$request->user() || !in_array($request->user()->role, $roles)) {
            return response()->json([
                'message' => 'غير مصرح لك بالوصول لهذه العملية، تتطلب صلاحيات: ' . implode(', ', $roles)
            ], 403);
        }

        return $next($request);
    }
}
