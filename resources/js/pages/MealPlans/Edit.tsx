import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useForm } from '@inertiajs/react';
import { useState } from 'react';

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

type MealPlan = {
    id: number;
    week_number: number;
    year: number;
    status: string;
    created_at: string;
    creator: {
        id: number;
        name: string;
    };
    items: MealPlanItem[];
};

type Props = {
    mealPlan: MealPlan;
};

const dayNames = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export default function Edit({ mealPlan }: Props) {
    const initialItems = mealPlan.items.map((item) => ({
        id: item.id,
        day_of_week: item.day_of_week,
        meal_suggestion_id: item.meal_suggestion.id,
    }));

    const { data, setData, patch, processing, errors } = useForm({
        week_number: mealPlan.week_number,
        year: mealPlan.year,
        status: mealPlan.status,
        items: initialItems,
    });

    const [duplicateDayError, setDuplicateDayError] = useState<string | null>(null);

    const updateItemDay = (itemId: number, newDayOfWeek: number) => {
        // Find the item to update
        const itemToUpdate = data.items.find((item) => item.id === itemId);
        if (!itemToUpdate) return;

        // Find any other item has this day
        const itemWithSameDay = data.items.find((item) => item.id !== itemId && item.day_of_week === newDayOfWeek);

        // Create updated items array
        const updatedItems = data.items.map((item) => {
            // Update the selected item with the new day
            if (item.id === itemId) {
                return { ...item, day_of_week: newDayOfWeek };
            }
            // If item has the same day, swap days
            if (itemWithSameDay && item.id === itemWithSameDay.id) {
                return { ...item, day_of_week: itemToUpdate.day_of_week };
            }
            return item;
        });

        setDuplicateDayError(null);
        setData('items', updatedItems);
    };

    const saveEdits = (e: React.FormEvent) => {
        e.preventDefault();

        // Check for duplicate days before submitting
        const dayCount = new Map<number, number>();
        data.items.forEach((item) => {
            dayCount.set(item.day_of_week, (dayCount.get(item.day_of_week) || 0) + 1);
        });

        // Find any day that appears more than once
        const duplicateDay = Array.from(dayCount.entries()).find((entry) => entry[1] > 1);

        if (duplicateDay) {
            setDuplicateDayError(`${dayNames[duplicateDay[0] - 1]} is assigned to multiple meals`);
            return;
        }

        patch(route('meal-plans.update', mealPlan.id), {
            onSuccess: () => {
                setOpen(false);
            },
        });
    };
    const [open, setOpen] = useState(false);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger>
                <Button>Edit Plan</Button>
            </DialogTrigger>
            <DialogContent>
                <form onSubmit={saveEdits}>
                    <DialogHeader>
                        <DialogTitle>Edit Meal Plan for {mealPlan.week_number}</DialogTitle>
                        <DialogDescription>Edit this weeks meal plan</DialogDescription>
                    </DialogHeader>
                    <div className="flex flex-col gap-4 py-4">
                        {data.items.map((item) => {
                            // Find the corresponding meal suggestion from mealPlan.items
                            const meal = mealPlan.items.find((m) => m.id === item.id);
                            if (!meal) return null;

                            return (
                                <ul key={item.id}>
                                    <li className="flex items-center justify-between gap-4 text-black">
                                        <span className="w-1/2">{meal.meal_suggestion.title}</span>{' '}
                                        <Select
                                            value={item.day_of_week.toString()}
                                            onValueChange={(value) => updateItemDay(item.id, parseInt(value))}
                                        >
                                            <SelectTrigger className="w-[180px]">
                                                <SelectValue placeholder={dayNames[item.day_of_week - 1]} />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectGroup>
                                                    {dayNames.map((day, index) => (
                                                        <SelectItem key={index} value={(index + 1).toString()}>
                                                            {day}
                                                        </SelectItem>
                                                    ))}
                                                </SelectGroup>
                                            </SelectContent>
                                        </Select>
                                    </li>
                                </ul>
                            );
                        })}
                    </div>
                    {duplicateDayError && <div className="mt-2 text-sm font-bold text-red-500">{duplicateDayError}</div>}
                    {errors.items && <div className="mt-2 text-sm text-red-500">{errors.items}</div>}
                    {errors.week_number && <div className="mt-2 text-sm text-red-500">{errors.week_number}</div>}
                    {errors.year && <div className="mt-2 text-sm text-red-500">{errors.year}</div>}
                    {errors.status && <div className="mt-2 text-sm text-red-500">{errors.status}</div>}
                    <DialogFooter>
                        <Button
                            variant="default"
                            className="cursor-pointer bg-blue-500 transition-colors duration-300 ease-in-out hover:bg-blue-700"
                            type="submit"
                            disabled={processing}
                        >
                            {processing ? 'Saving...' : 'Save Edits'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
