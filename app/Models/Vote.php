<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Model;
use App\Models\MealSuggestion;
use App\Models\User;

class Vote extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'meal_suggestion_id',
        'value',

    ];

    public function user(): BelongsTo 
    {
       return $this->belongsTo(User::class);
    }

    public function mealSuggestion() :BelongsTo {
        return $this->belongsTo(MealSuggestion::class);
    }

}