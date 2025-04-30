<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use  App\Models\MealSuggestion;
use Inertia\Inertia;

class MealSuggestionController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $mealSuggestions = MealSuggestion::with('user')->latest()->get();
        return Inertia::render('MealSuggestions/Index', [
            'mealSuggestions' => $mealSuggestions
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $currentWeek = now()->weekOfYear;
        return Inertia::render('MealSuggestions/Create', ['currentWeek' => $currentWeek]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
      $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string', 
            'week_number' => 'required|numeric|min:1|max:52',
        ]);

        $meal = $request->user()->mealSuggestions()->create($validated);

        return redirect()->route('meal-suggestions.index');
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $mealSuggestion = MealSuggestion::with('user')->findOrFail($id);

        return Inertia::render('MealSuggestions/Show', [
            'mealSuggestion' => $mealSuggestion
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        $mealSuggestion = MealSuggestion::with('user')->findOrFail($id);
        
        return Inertia::render('MealSuggestions/Edit', [
            'mealSuggestion' => $mealSuggestion
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string', 
            'week_number' => 'required|numeric|min:1|max:52',
        ]);

        $mealSuggestion = MealSuggestion::findOrFail($id);

        $mealSuggestion->update($validated);

        return redirect()->route('meal-suggestions.show', $mealSuggestion);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $mealSuggestion = MealSuggestion::findOrFail($id);

        $mealSuggestion->delete();

        return redirect()->route('meal-suggestions.index');
    }
}