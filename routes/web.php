<?php

use App\Http\Controllers\FindLeadsController;
use App\Http\Controllers\LeadController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', static function () {
    return redirect()->route('login');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', static function () {
        return Inertia::render('dashboard');
    })->name('dashboard');

    // Find leads routes must come before resource routes to avoid conflicts
    Route::get('leads/find', [FindLeadsController::class, 'index'])->name('leads.find');
    Route::post('leads/find', [FindLeadsController::class, 'trigger'])->name('leads.find.trigger');
    Route::get('leads/find/status/{jobId}', [FindLeadsController::class, 'status'])->name('leads.find.status');

    Route::resource('leads', LeadController::class);
});

require __DIR__.'/settings.php';
