import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import VoteButton from '@/components/vote-button';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import Edit from './Edit';

// Define the type for a meal suggestion
type MealSuggestion = {
    id: number;
    title: string;
    description: string | null;
    week_number: number;
    vote_count: number;
    user: {
        id: number;
        name: string;
        role: string;
    };
};

// Define the props for our component
type Props = {
    mealSuggestion: MealSuggestion;
};

export default function Show({ mealSuggestion }: Props) {
    const { auth } = usePage<{ auth: { user: { id: number } } }>().props;
    const isOwner = auth.user.id === mealSuggestion.user.id;

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Dashboard',
            href: '/dashboard',
        },
        {
            title: 'Meal Suggestions',
            href: '/meal-suggestions',
        },
        {
            title: `${mealSuggestion.title}`,
            href: `/meal-suggestions/${mealSuggestion.id}`,
        },
    ];

    const { delete: destroy } = useForm();
    const [deleteDialogOpen, setDeleteDialogOpen] = useState<boolean>(false);

    const deleteSuggestion = () => {
        setDeleteDialogOpen(true);
    };

    const confirmDelete = () => {
        destroy(route('meal-suggestions.destroy', mealSuggestion.id), {
            onSuccess: () => {
                toast('Your Meal Suggestion has successfully been deleted.');
                setDeleteDialogOpen(false);
            },
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={`Meal Suggestion: ${mealSuggestion.title}`} />
            <div className="flex flex-col gap-4 p-6">
                <div className="flex flex-col gap-4 p-6">
                    <h1 className="text-3xl font-bold">{mealSuggestion.title}</h1>
                    <VoteButton mealSuggestionId={mealSuggestion.id} initialVoteCount={mealSuggestion.vote_count || 0} />
                    <p className="text-lg">{mealSuggestion.description}</p>
                    <p>Suggested by: {mealSuggestion.user.name}</p>
                    <div className="flex items-center gap-4">
                        {isOwner && (
                            <>
                                <Edit mealSuggestion={mealSuggestion} />
                                <Button
                                    variant="destructive"
                                    className="cursor-pointer bg-red-500 transition-colors duration-300 ease-in-out hover:bg-red-700"
                                    onClick={deleteSuggestion}
                                >
                                    Delete Suggestion
                                </Button>
                            </>
                        )}
                    </div>
                    <div>
                        <Link href="/meal-suggestions">
                            <Button
                                variant="default"
                                className="cursor-pointer bg-blue-500 transition-colors duration-300 ease-in-out hover:bg-blue-700"
                            >
                                <ArrowLeft /> Back to Suggestions
                            </Button>
                        </Link>
                    </div>
                </div>
            </div>
            {/* Delete Confirmation Dialog */}
            <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Delete Meal Suggestion</DialogTitle>
                        <DialogDescription>Are you sure you want to delete this meal suggestion? This action cannot be undone.</DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
                            Cancel
                        </Button>
                        <Button variant="destructive" onClick={confirmDelete}>
                            Delete
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}
