import React, { useState } from 'react'
import { Plus, DollarSign, Receipt, ArrowUpRight, ArrowDownLeft, Wallet } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useQuery, useMutation } from 'convex/react'
import { api } from '@/convex/_generated/api'
import { Id } from '@/convex/_generated/dataModel'
import { useUser } from '@clerk/nextjs'

interface ExpenseSplitterProps {
    tripId: Id<"GroupTrips">;
}

function ExpenseSplitter({ tripId }: ExpenseSplitterProps) {
    const { user } = useUser();
    const trip = useQuery(api.group_trips.getGroupTrip, { id: tripId });
    const addExpense = useMutation(api.group_trips.addExpense);

    const [open, setOpen] = useState(false);
    const [description, setDescription] = useState('');
    const [amount, setAmount] = useState('');
    const [payer, setPayer] = useState('me'); // 'me' or memberId

    const handleAddExpense = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!amount || !description || !user) return;

        await addExpense({
            tripId,
            description,
            amount: parseFloat(amount),
            paidBy: payer === 'me' ? (user.id || "test_user_id") : payer,
            category: 'General', // Default category
        });
        setOpen(false);
        setDescription('');
        setAmount('');
        setPayer('me');
    }

    if (!trip) return <div>Loading expenses...</div>;

    // Calculate totals
    const totalSpent = trip.expenses.reduce((acc: number, curr: any) => acc + curr.amount, 0);
    const budgetProgress = trip.budget ? Math.min((totalSpent / trip.budget.total) * 100, 100) : 0;

    // Simple logic: You paid X, your share is Total / Members. Difference is balance.
    // This is a simplified view for the prototype.
    const myId = user?.id || "test_user_id";
    const myPaid = trip.expenses
        .filter((e: any) => e.paidBy === myId)
        .reduce((acc: number, curr: any) => acc + curr.amount, 0);

    // Assuming equal split for everyone for now
    const myShare = totalSpent / (trip.members.length || 1);
    const myBalance = myPaid - myShare;

    return (
        <div className="space-y-8">
            {/* Overview Cards */}
            <div className="grid md:grid-cols-3 gap-4">
                <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg text-green-600">
                            <Wallet className="w-5 h-5" />
                        </div>
                        <span className="text-sm font-medium text-gray-500">Total Budget</span>
                    </div>
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">
                        ${trip.budget?.total.toLocaleString()}
                    </div>
                    <Progress value={budgetProgress} className="h-2 mt-4" indicatorClassName="bg-green-500" />
                    <p className="text-xs text-gray-400 mt-2">${totalSpent.toLocaleString()} spent ({Math.round(budgetProgress)}%)</p>
                </div>

                <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg text-blue-600">
                            <ArrowUpRight className="w-5 h-5" />
                        </div>
                        <span className="text-sm font-medium text-gray-500">You Paid</span>
                    </div>
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">
                        ${myPaid.toLocaleString()}
                    </div>
                    <p className="text-xs text-gray-400 mt-2">for {trip.expenses.filter((e: any) => e.paidBy === myId).length} items</p>
                </div>

                <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm">
                    <div className="flex items-center gap-3 mb-2">
                        <div className={`p-2 rounded-lg ${myBalance >= 0 ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
                            {myBalance >= 0 ? <ArrowDownLeft className="w-5 h-5" /> : <ArrowUpRight className="w-5 h-5" />}
                        </div>
                        <span className="text-sm font-medium text-gray-500">Your Balance</span>
                    </div>
                    <div className={`text-2xl font-bold ${myBalance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {myBalance >= 0 ? '+' : ''}${Math.round(myBalance).toLocaleString()}
                    </div>
                    <p className="text-xs text-gray-400 mt-2">{myBalance >= 0 ? 'You are owed' : 'You owe'}</p>
                </div>
            </div>

            {/* Expenses List */}
            <div className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 overflow-hidden">
                <div className="p-6 flex items-center justify-between border-b border-gray-100 dark:border-gray-800">
                    <h3 className="font-bold text-xl text-gray-900 dark:text-white">Recent Expenses</h3>
                    <Dialog open={open} onOpenChange={setOpen}>
                        <DialogTrigger asChild>
                            <Button className="bg-pink-600 hover:bg-pink-700 text-white rounded-xl gap-2">
                                <Plus className="w-4 h-4" /> Add Expense
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Add Expense</DialogTitle>
                            </DialogHeader>
                            <form onSubmit={handleAddExpense} className="space-y-4 py-4">
                                <div className="space-y-2">
                                    <Label>Description</Label>
                                    <Input
                                        placeholder="Dinner at Mario's"
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Amount ($)</Label>
                                    <Input
                                        type="number"
                                        placeholder="120.50"
                                        value={amount}
                                        onChange={(e) => setAmount(e.target.value)}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Paid By</Label>
                                    <select
                                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                        value={payer}
                                        onChange={(e) => setPayer(e.target.value)}
                                    >
                                        <option value="me">Me</option>
                                        {trip.members.filter((m: any) => m.userId !== myId).map((m: any) => (
                                            <option key={m.userId} value={m.userId}>{m.name}</option>
                                        ))}
                                    </select>
                                </div>
                                <Button type="submit" className="w-full bg-pink-600 hover:bg-pink-700 text-white">
                                    Add Expense
                                </Button>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>

                <div className="divide-y divide-gray-100 dark:divide-gray-800">
                    {trip.expenses.length === 0 ? (
                        <div className="p-12 text-center text-gray-400">
                            No expenses recorded yet.
                        </div>
                    ) : (
                        trip.expenses.slice().reverse().map((expense: any) => (
                            <div key={expense.id} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center text-gray-500">
                                        <Receipt className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="font-bold text-gray-900 dark:text-white">{expense.description}</p>
                                        <p className="text-sm text-gray-500">
                                            Paid by <span className="font-medium text-gray-700 dark:text-gray-300">
                                                {expense.paidBy === myId ? 'You' : (trip.members.find((m: any) => m.userId === expense.paidBy)?.name || 'Someone')}
                                            </span>
                                        </p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="font-bold text-gray-900 dark:text-white">${expense.amount.toFixed(2)}</p>
                                    <p className="text-xs text-gray-400">{new Date(expense.date).toLocaleDateString()}</p>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    )
}

export default ExpenseSplitter
