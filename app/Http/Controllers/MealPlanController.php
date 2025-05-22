<?php

namespace App\Http\Controllers;

use App\Models\MealPlan;
use App\Models\MealPlanItem;
use App\Models\MealSuggestion;
use App\Models\Vote;
use Illuminate\Http\Request;
use Inertia\Inertia;

class MealPlanController extends Controller
{
    /**
     * Display a listing of the meal plans.
     */
    public function index()
    {
        $mealPlans = MealPlan::with('creator')
            ->orderBy('year', 'desc')
            ->orderBy('week_number', 'desc')
            ->paginate(10);
            
        return Inertia::render('MealPlans/Index', [
            'mealPlans' => $mealPlans
        ]);
    }

    /**
     * Show the form for creating a new meal plan.
     */
    public function create()
    {
        return Inertia::render('MealPlans/Create');
    }

    /**
     * Store a newly created meal plan in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'week_number' => 'required|integer|min:1|max:52',
            'year' => 'required|integer|min:2025',
        ]);

        // Check if a meal plan already exists for this week/year
        $existingPlan = MealPlan::where('week_number', $validated['week_number'])
            ->where('year', $validated['year'])
            ->first();
            
        if ($existingPlan) {
            return back()->with('error', 'A meal plan already exists for this week.');
        }

        // Create the meal plan
        $mealPlan = MealPlan::create([
            'week_number' => $validated['week_number'],
            'year' => $validated['year'],
            'created_by' => auth()->id(),
            'status' => 'draft',
        ]);

        // Generate meal plan items from top-voted suggestions
        $this->generateMealPlanItems($mealPlan);

        return redirect()->route('meal-plans.show', $mealPlan)
            ->with('success', 'Meal plan created successfully.');
    }

    /**
     * Display the specified meal plan.
     */
    public function show(MealPlan $mealPlan)
    {
        $mealPlan->load(['items.mealSuggestion', 'creator']);
        
        return Inertia::render('MealPlans/Show', [
            'mealPlan' => $mealPlan
        ]);
    }

    /**
     * Show the form for editing the specified meal plan.
     */
    public function edit(MealPlan $mealPlan)
    {
        $mealPlan->load(['items.mealSuggestion']);
        $mealSuggestions = MealSuggestion::all();
        
        return Inertia::render('MealPlans/Edit', [
            'mealPlan' => $mealPlan,
            'mealSuggestions' => $mealSuggestions
        ]);
    }

    /**
     * Update the specified meal plan in storage.
     */
    public function update(Request $request, MealPlan $mealPlan)
    {
        $validated = $request->validate([
            'week_number' => 'required|integer|min:1|max:52',
            'year' => 'required|integer|min:2025',
            'status' => 'required|in:draft,published',
            'items' => 'required|array',
            'items.*.day_of_week' => 'required|integer|min:1|max:7',
            'items.*.meal_suggestion_id' => 'required|exists:meal_suggestions,id',
        ]);

        // Update meal plan
        $mealPlan->update([
            'week_number' => $validated['week_number'],
            'year' => $validated['year'],
            'status' => $validated['status'],
        ]);

        // Delete existing items
        $mealPlan->items()->delete();

        // Create new items
        foreach ($validated['items'] as $item) {
            MealPlanItem::create([
                'meal_plan_id' => $mealPlan->id,
                'meal_suggestion_id' => $item['meal_suggestion_id'],
                'day_of_week' => $item['day_of_week'],
            ]);
        }

        return redirect()->route('meal-plans.show', $mealPlan)
            ->with('success', 'Meal plan updated successfully.');
    }

    /**
     * Remove the specified meal plan from storage.
     */
    public function destroy(MealPlan $mealPlan)
    {
        $mealPlan->delete();
        
        return redirect()->route('meal-plans.index')
            ->with('success', 'Meal plan deleted successfully.');
    }

    /**
     * Generate meal plan items from top-voted suggestions.
     */
    private function generateMealPlanItems(MealPlan $mealPlan)
    {
        // Get top 7 meal suggestions by votes
        $topSuggestions = MealSuggestion::withCount(['votes as vote_count' => function ($query) {
                $query->select(\DB::raw('SUM(value)'));
            }])
            ->orderBy('vote_count', 'desc')
            ->take(7)
            ->get();

        // Create a meal plan item for each day of the week
        foreach ($topSuggestions as $index => $suggestion) {
            // Days 1-7 (Monday to Sunday)
            $dayOfWeek = $index + 1;
            
            MealPlanItem::create([
                'meal_plan_id' => $mealPlan->id,
                'meal_suggestion_id' => $suggestion->id,
                'day_of_week' => $dayOfWeek,
            ]);
        }
    }
}