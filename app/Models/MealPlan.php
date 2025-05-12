<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasManyThrough;

class MealPlan extends Model
{
    protected $fillable = [
        'week_number',
        'year',
        'created_by',
        'status',
    ];

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function items():HasMany {
        return $this->hasMany(MealPlanItem::class);
    }

    public function mealSuggestions()
    {
        return $this->hasManyThrough(MealSuggestion::class, MealPlanItem::class);
    }
}