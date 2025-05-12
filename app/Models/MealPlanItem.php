<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class MealPlanItem extends Model
{
    protected $fillable = [
        'meal_plan_id',
        'meal_suggestion_id',
        'day_of_week',
    ];

    public function mealPlan(): BelongsTo {
        return $this->belongsTo(MealPlan::class);
    }

    public function mealSuggestion(): BelongsTo {
        return $this->belongsTo(MealSuggestion::class);
    }
}