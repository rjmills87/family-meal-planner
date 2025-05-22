import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useForm } from '@inertiajs/react';
import { useState } from 'react';

function getCurrentWeek(): number {
    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 1);
    const diff = now.getTime() - start.getTime();
    const oneWeek = 604800000; // milliseconds in a week
    return Math.ceil((diff + (start.getDay() + 1) * 86400000) / oneWeek);
}

export default function Create() {
    const { data, setData, post, processing, errors, reset } = useForm({
        title: '',
        description: '',
        week_number: getCurrentWeek(),
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('meal-suggestions.store'), {
            onSuccess: () => {
                reset();
                setOpen(false);
            },
        });
    };

    const [open, setOpen] = useState(false);

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger>
                <Button className="cursor-pointer bg-blue-500 transition-colors duration-300 ease-in-out hover:bg-blue-700">
                    Add New Suggestion
                </Button>
            </DialogTrigger>
            <DialogContent>
                <form onSubmit={submit}>
                    <DialogHeader>
                        <DialogTitle>Create a Meal Suggestion</DialogTitle>
                        <DialogDescription>Fill in the form below to create a Meal Suggestion.</DialogDescription>
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
                                value={data.description}
                                onChange={(e) => setData('description', e.target.value)}
                                placeholder="Enter a brief description of your meal."
                            />
                            {errors.description && <div>{errors.description}</div>}

                            <Label>Week</Label>
                            <Input id="week_number" value={data.week_number} onChange={(e) => setData('week_number', Number(e.target.value))} />
                        </div>
                    </div>
                    <DialogFooter>
                        <Button className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600" disabled={processing}>
                            {processing ? 'Creating...' : 'Create Suggestion'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
