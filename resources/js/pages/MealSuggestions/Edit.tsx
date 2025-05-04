import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useForm } from '@inertiajs/react';
import { useState } from 'react';

type MealSuggestion = {
    id: number;
    title: string;
    description: string | null;
    week_number: number;
};

type Props = {
    mealSuggestion: MealSuggestion;
};

export default function Edit({ mealSuggestion }: Props) {
    const { data, setData, patch, processing, errors } = useForm({
        title: mealSuggestion.title,
        description: mealSuggestion.description,
        week_number: mealSuggestion.week_number,
    });

    const saveEdits = (e: React.FormEvent) => {
        e.preventDefault();
        patch(route('meal-suggestions.update', mealSuggestion.id), {
            onSuccess: () => {
                setOpen(false);
            },
        });
    };

    const [open, setOpen] = useState(false);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger>
                <Button variant="default" className="cursor-pointer bg-blue-500 transition-colors duration-300 ease-in-out hover:bg-blue-700">
                    Edit Suggestion
                </Button>
            </DialogTrigger>
            <DialogContent>
                <form onSubmit={saveEdits}>
                    <DialogHeader>
                        <DialogTitle>Edit Meal Suggestion</DialogTitle>
                        <DialogDescription>Amend the fields below to edit the Meal Suggestion.</DialogDescription>
                    </DialogHeader>
                    <div className="py-4">
                        <div className="flex flex-col gap-6">
                            <Label>Title</Label>
                            <Input
                                id="title"
                                value={data.title}
                                onChange={(e) => setData('title', e.target.value)}
                                placeholder="Enter the name of your meal."
                            />
                            {errors.title && <div>{errors.title}</div>}
                            <Label>Description</Label>
                            <Textarea
                                id="description"
                                value={data.description || ''}
                                onChange={(e) => setData('description', e.target.value)}
                                placeholder="Enter a brief description of your meal."
                            />
                            {errors.description && <div>{errors.description}</div>}

                            <Label>Week</Label>
                            <Input id="week_number" value={data.week_number} onChange={(e) => setData('week_number', Number(e.target.value))} />
                        </div>
                    </div>
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
