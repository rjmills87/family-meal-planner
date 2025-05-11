<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\MealSuggestionController;
use App\Http\Controllers\VoteController;

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

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';