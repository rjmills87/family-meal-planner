import { cn } from '@/lib/utils';

type MealSuggestion = {
    id: number;
    title: string;
    description: string | null;
};

type MealPlanItem = {
    id: number;
    day_of_week: number;
    meal_suggestion: MealSuggestion;
};

export type Props = {
    items: MealPlanItem[];
    className?: string;
};

const dayNames = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export default function CalendarView({ items, className }: Props) {
    const mealsByDay = new Map<number, MealPlanItem>();

    items.forEach((item) => {
        mealsByDay.set(item.day_of_week, item);
    });

    return (
        <div className={cn('w-full', className)}>
            <div className="grid grid-cols-7 gap-2">
                {/* Calendar header - days of the week */}
                {dayNames.map((day, index) => (
                    <div key={`header-${index}`} className="rounded-t-md bg-gray-100 p-2 text-center font-medium">
                        {day}
                    </div>
                ))}

                {/* Calendar body - meals for each day */}
                {dayNames.map((_, index) => {
                    const dayNumber = index + 1;
                    const meal = mealsByDay.get(dayNumber);

                    return (
                        <div key={`day-${dayNumber}`} className="flex min-h-[120px] flex-col rounded-b-md border bg-white p-4">
                            {meal ? (
                                <>
                                    <h3 className="mb-1 font-medium text-gray-900">{meal.meal_suggestion.title}</h3>
                                    {meal.meal_suggestion.description && (
                                        <p className="mb-2 line-clamp-3 flex-grow text-sm text-gray-500">{meal.meal_suggestion.description}</p>
                                    )}
                                </>
                            ) : (
                                <div className="flex h-full items-center justify-center text-gray-400">No meal planned</div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
