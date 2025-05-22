<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\MealSuggestionController;
use App\Http\Controllers\VoteController;
use App\Http\Controllers\MealPlanController;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {
        return Inertia::render('dashboard');
    })->name('dashboard');
});

// Meal Suggestions Route
Route::resource('meal-suggestions', MealSuggestionController::class)
->middleware(['auth', 'verified']);

// Votes Route
Route::middleware(['auth', 'verified'])->group(function() {
    Route::post('/votes', [VoteController::class, 'store'])->name('votes.store');
    Route::delete('/votes/{vote}', [VoteController::class, 'destroy'])->name('votes.destroy');
});

// Meal Plans Route
Route::resource('meal-plans', MealPlanController::class)
->middleware(['auth', 'verified']);

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';