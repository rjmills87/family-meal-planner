<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Vote;

class VoteController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'meal_suggestion_id' => 'required|exists:meal_suggestions,id',
            'value' => 'required|numeric|min:1|max:1'
        ]);

        // Create or Update the vote
        $vote = $request->user()->votes()->updateOrCreate(
            ['meal_suggestion_id' => $validated['meal_suggestion_id']],
            ['value' => $validated['value']]
        );

        $voteCount = Vote::where('meal_suggestion_id', $validated['meal_suggestion_id'])->sum('value');

        if ($request->wantsJson()) {
            return response()->json([
                'success' => true,
                'vote' => $vote,
                'vote_count' => $voteCount
            ]);
        }
    
        return back()->with([
            'success' => true,
            'message' => 'Vote recorded successfully'
        ]);
    
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $vote = Vote::findOrFail($id);

        if ($vote->user_id !== auth()->id()) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $mealSuggestionId = $vote->meal_suggestion_id;

        $vote->delete();

        $voteCount = Vote::where('meal_suggestion_id', $mealSuggestionId)->sum('value');

        return response()->json([
            'success' => true,
            'vote_count' => $voteCount
        ]);
    }
}