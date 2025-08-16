import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { customizationService } from '@/services/customizationService';
import { Plus, Edit, Trash2 } from 'lucide-react';

interface Dispo {
	key: string;
	name: string;
	category: string;
	description?: string;
	is_active: boolean;
}

export const DispositionsManager = () => {
	const { toast } = useToast();
	const [dispos, setDispos] = useState<Dispo[]>([]);
	const [search, setSearch] = useState('');
	const [page, setPage] = useState(1);
	const pageSize = 10;
	const [total, setTotal] = useState(0);
	const totalPages = Math.max(1, Math.ceil(total / pageSize));

	const [isCreateOpen, setIsCreateOpen] = useState(false);
	const [newDispo, setNewDispo] = useState({ key: '', name: '', category: 'Support', description: '' });

	const [editing, setEditing] = useState<Dispo | null>(null);
	const [isEditOpen, setIsEditOpen] = useState(false);
	const [fields, setFields] = useState<any[]>([]);
	const [isAddFieldOpen, setIsAddFieldOpen] = useState(false);
	const [newField, setNewField] = useState({ name: '', label: '', type: 'text', required: false, options: '' });

	useEffect(() => {
		const load = async () => {
			const [list] = await Promise.all([
				customizationService.listDispositions(),
			]);
			const filtered = (list || []).filter((d: any) => !search || d.name.toLowerCase().includes(search.toLowerCase()) || d.category.toLowerCase().includes(search.toLowerCase()));
			setTotal(filtered.length);
			setDispos(filtered.slice((page-1)*pageSize, page*pageSize));
		};
		load();
	}, [page, search]);

	const handleCreate = async () => {
		if (!newDispo.key || !newDispo.name) {
			toast({ title: 'Key and Name are required', variant: 'destructive' });
			return;
		}
		const created = await customizationService.createDisposition({ key: newDispo.key, name: newDispo.name, category: newDispo.category, description: newDispo.description });
		if (created) {
			setDispos(prev => [{ key: created.key, name: created.name, category: created.category, description: created.description, is_active: created.is_active }, ...prev]);
			setTotal(t => t+1);
			toast({ title: 'Disposition Created' });
		}
		setIsCreateOpen(false);
		setNewDispo({ key: '', name: '', category: 'Support', description: '' });
	};

	const handleUpdate = async () => {
		if (!editing) return;
		const updated = await customizationService.updateDisposition(editing.key, { name: editing.name, category: editing.category, description: editing.description, is_active: editing.is_active });
		if (updated) {
			setDispos(prev => prev.map(d => d.key === editing.key ? { ...editing } : d));
			toast({ title: 'Disposition Updated' });
		}
		setIsEditOpen(false);
	};

	const handleDelete = async (key: string) => {
		await customizationService.deleteDisposition(key);
		setDispos(prev => prev.filter(d => d.key !== key));
		setTotal(t => Math.max(0, t-1));
		toast({ title: 'Disposition Deleted' });
	};

	const loadFields = async (key: string) => {
		const list = await customizationService.listDispositionFields(key);
		setFields(list || []);
	};

	const openEdit = async (d: Dispo) => {
		setEditing(d);
		await loadFields(d.key);
		setIsEditOpen(true);
	};

	return (
		<div className="space-y-6">
			<div className="flex justify-between items-center">
				<div>
					<h2 className="text-2xl font-semibold text-gray-900">Dispositions</h2>
					<p className="text-gray-600">Manage categories and resolution dispositions</p>
				</div>
				<div className="flex items-center gap-2">
					<Input placeholder="Search dispositions..." value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} />
					<Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
						<DialogTrigger asChild>
							<Button size="sm"><Plus className="w-4 h-4 mr-2" /> New Disposition</Button>
						</DialogTrigger>
						<DialogContent className="bg-white max-w-md">
							<DialogHeader>
								<DialogTitle>Create Disposition</DialogTitle>
								<DialogDescription>Define a new disposition</DialogDescription>
							</DialogHeader>
							<div className="space-y-4">
								<div>
									<Label>Key</Label>
									<Input value={newDispo.key} onChange={(e) => setNewDispo(prev => ({ ...prev, key: e.target.value }))} placeholder="unique_key" />
								</div>
								<div>
									<Label>Name</Label>
									<Input value={newDispo.name} onChange={(e) => setNewDispo(prev => ({ ...prev, name: e.target.value }))} />
								</div>
								<div>
									<Label>Category</Label>
									<Select value={newDispo.category} onValueChange={(v) => setNewDispo(prev => ({ ...prev, category: v }))}>
										<SelectTrigger><SelectValue /></SelectTrigger>
										<SelectContent className="bg-white">
											{['Support','Billing','Sales','Other'].map(c => (<SelectItem key={c} value={c}>{c}</SelectItem>))}
										</SelectContent>
									</Select>
								</div>
								<div>
									<Label>Description</Label>
									<Input value={newDispo.description} onChange={(e) => setNewDispo(prev => ({ ...prev, description: e.target.value }))} />
								</div>
								<Button onClick={handleCreate} className="w-full">Create</Button>
							</div>
						</DialogContent>
					</Dialog>
				</div>
			</div>

			<Card>
				<CardHeader className="border-b border-slate-100 bg-slate-50/50">
					<CardTitle className="text-base font-bold text-slate-900">Existing Dispositions</CardTitle>
					<CardDescription>Manage your disposition catalog</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="space-y-3">
						{dispos.map(d => (
							<div key={d.key} className="flex items-center justify-between p-3 border rounded-lg">
								<div className="flex items-center gap-3">
									<Badge variant="outline">{d.category}</Badge>
									<div>
										<div className="font-medium">{d.name}</div>
										<div className="text-xs text-slate-500">{d.description}</div>
									</div>
								</div>
								<div className="flex items-center gap-1">
									<Button variant="ghost" size="sm" onClick={() => openEdit(d)}><Edit className="w-4 h-4" /></Button>
									<Button variant="ghost" size="sm" className="text-red-600" onClick={() => handleDelete(d.key)}><Trash2 className="w-4 h-4" /></Button>
								</div>
							</div>
						))}
					</div>

					<div className="flex items-center justify-end gap-2 mt-4 text-sm">
						<Button variant="outline" size="sm" disabled={page===1} onClick={() => setPage(p => Math.max(1, p-1))}>Prev</Button>
						<span>Page {page} of {totalPages}</span>
						<Button variant="outline" size="sm" disabled={page>=totalPages} onClick={() => setPage(p => Math.min(totalPages, p+1))}>Next</Button>
					</div>
				</CardContent>
			</Card>

			{/* Edit dialog */}
			<Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
				<DialogContent className="bg-white max-w-2xl">
					<DialogHeader>
						<DialogTitle>Edit Disposition</DialogTitle>
					</DialogHeader>
					<div className="space-y-6">
						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<div>
								<Label>Name</Label>
								<Input value={editing?.name || ''} onChange={(e) => setEditing(prev => prev ? { ...prev, name: e.target.value } : prev)} />
							</div>
							<div>
								<Label>Category</Label>
								<Select value={editing?.category || 'Support'} onValueChange={(v) => setEditing(prev => prev ? { ...prev, category: v } : prev)}>
									<SelectTrigger><SelectValue /></SelectTrigger>
									<SelectContent className="bg-white">
										{['Support','Billing','Sales','Other'].map(c => (<SelectItem key={c} value={c}>{c}</SelectItem>))}
									</SelectContent>
								</Select>
							</div>
							<div>
								<Label>Description</Label>
								<Input value={editing?.description || ''} onChange={(e) => setEditing(prev => prev ? { ...prev, description: e.target.value } : prev)} />
							</div>
							<div>
								<Label>Status</Label>
								<Select value={editing?.is_active ? 'active' : 'inactive'} onValueChange={(v) => setEditing(prev => prev ? { ...prev, is_active: v==='active' } : prev)}>
									<SelectTrigger><SelectValue /></SelectTrigger>
									<SelectContent className="bg-white">
										<SelectItem value="active">Active</SelectItem>
										<SelectItem value="inactive">Inactive</SelectItem>
									</SelectContent>
								</Select>
							</div>
						</div>

						{/* Per-disposition fields */}
						<div className="space-y-3">
							<div className="flex items-center justify-between">
								<h4 className="font-medium">Fields for this disposition</h4>
								<Dialog open={isAddFieldOpen} onOpenChange={setIsAddFieldOpen}>
									<DialogTrigger asChild>
										<Button size="sm"><Plus className="w-4 h-4 mr-2" /> Add Field</Button>
									</DialogTrigger>
									<DialogContent className="bg-white max-w-md">
										<DialogHeader>
											<DialogTitle>Add Field</DialogTitle>
											<DialogDescription>Define a field for this disposition</DialogDescription>
										</DialogHeader>
										<div className="space-y-3">
											<div>
												<Label>Name</Label>
												<Input value={newField.name} onChange={(e) => setNewField(prev => ({ ...prev, name: e.target.value }))} placeholder="internal_name" />
											</div>
											<div>
												<Label>Label</Label>
												<Input value={newField.label} onChange={(e) => setNewField(prev => ({ ...prev, label: e.target.value }))} />
											</div>
											<div>
												<Label>Type</Label>
												<Select value={newField.type} onValueChange={(v) => setNewField(prev => ({ ...prev, type: v }))}>
													<SelectTrigger><SelectValue /></SelectTrigger>
													<SelectContent className="bg-white">
														{['text','textarea','number','select'].map(t => (<SelectItem key={t} value={t}>{t}</SelectItem>))}
													</SelectContent>
												</Select>
											</div>
											<div>
												<Label>Required</Label>
												<Select value={newField.required ? 'yes' : 'no'} onValueChange={(v) => setNewField(prev => ({ ...prev, required: v==='yes' }))}>
													<SelectTrigger><SelectValue /></SelectTrigger>
													<SelectContent className="bg-white">
														<SelectItem value="yes">Yes</SelectItem>
														<SelectItem value="no">No</SelectItem>
													</SelectContent>
												</Select>
											</div>
											{newField.type === 'select' && (
												<div>
													<Label>Options (comma-separated)</Label>
													<Input value={newField.options} onChange={(e) => setNewField(prev => ({ ...prev, options: e.target.value }))} placeholder="Option 1, Option 2" />
												</div>
											)}
																										<Button onClick={async () => {
																if (!editing) return;
																const created = await customizationService.createDispositionField({
																	disposition_key: editing.key,
																	name: newField.name,
																	type: newField.type,
																	label: newField.label,
																	required: newField.required,
																	options: newField.type==='select' ? (newField.options.split(',').map(s => s.trim()).filter(Boolean)) : [],
																});
																if (created) {
																	await loadFields(editing.key);
																	setIsAddFieldOpen(false);
																	setNewField({ name: '', label: '', type: 'text', required: false, options: '' });
																	toast({ title: 'Field added' });
																}
																											}} className="w-full">Add Field</Button>
											</div>
											</DialogContent>
													</Dialog>
												</div>
							<div className="space-y-2">
								{fields.length === 0 && <div className="text-sm text-slate-500">No fields yet</div>}
								{fields.map((f: any) => (
									<div key={f.id} className="flex items-center justify-between p-2 border rounded">
										<div>
											<div className="text-sm font-medium">{f.label} <span className="text-xs text-slate-500">({f.type}) {f.required ? '• required' : ''}</span></div>
											{Array.isArray(f.options) && f.options.length > 0 && (
												<div className="text-xs text-slate-500">Options: {f.options.join(', ')}</div>
											)}
										</div>
										<Button variant="ghost" size="sm" className="text-red-600" onClick={async () => { await customizationService.deleteDispositionField(f.id); await loadFields(editing!.key); toast({ title: 'Field removed' }); }}><Trash2 className="w-4 h-4" /></Button>
									</div>
								))}
							</div>
						</div>

						<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
							<Button onClick={handleUpdate}>Save Changes</Button>
							<Button variant="outline" onClick={() => setIsEditOpen(false)}>Close</Button>
						</div>
					</div>
				</DialogContent>
			</Dialog>
		</div>
	);
} 