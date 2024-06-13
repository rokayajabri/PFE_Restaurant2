<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CaissierMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle($request, Closure $next)
    {
        if ($request->user()->roles()->where('name', 'caissier')->exists()) {
            return $next($request);
        }
        if (auth()->check() && auth()->user()->role === 'Caissier') {
            return $next($request);
        }

        return redirect('/');
    }
}
