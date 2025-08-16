import { supabase } from '@/integrations/supabase/client';

// Shared helper to handle Supabase errors and provide safe fallbacks
const safeQuery = async <T>(query: any, fallback: T, operation: string): Promise<T> => {
	try {
		console.log(`${operation}: Executing query...`);
		const { data, error } = await query;
		console.log(`${operation}: Query result:`, { data, error });
		
		if (error) {
			console.error(`${operation}: Database error:`, error);
			throw error;
		}
		
		console.log(`${operation}: Success, returning data:`, data);
		return data;
	} catch (error) {
		console.error(`${operation}: Caught error:`, error);
		console.error(`${operation}: Error details:`, {
			message: error instanceof Error ? error.message : 'Unknown error',
			code: (error as any)?.code,
			details: (error as any)?.details,
			hint: (error as any)?.hint
		});
		return fallback;
	}
};

// Themes
export interface ThemeConfig {
	id?: string;
	name: string;
	primary_color: string;
	secondary_color: string;
	font_family: string;
	created_at?: string;
	updated_at?: string;
}

export const customizationService = {
	// DATABASE INITIALIZATION
	async initializeDatabase(): Promise<boolean> {
		try {
			console.log('Checking if customization tables exist...');
			
			// Check if object_relationships table exists by trying to select from it
			const { error: relError } = await (supabase as any).from('object_relationships').select('id').limit(1);
			if (relError && relError.code === '42P01') { // Table doesn't exist
				console.error('object_relationships table does not exist. Please run the CUSTOMIZATION_STUDIO_SCHEMA.sql in your Supabase dashboard.');
				throw new Error('Database tables not found. Please run the CUSTOMIZATION_STUDIO_SCHEMA.sql script in your Supabase dashboard to create the required tables.');
			} else if (relError) {
				console.error('Error checking object_relationships table:', relError);
				throw new Error(`Database error: ${relError.message}`);
			} else {
				console.log('Customization tables exist and are accessible');
			}

			// Check if workflows table exists and test insert
			const { error: workflowError } = await (supabase as any).from('workflows').select('id').limit(1);
			if (workflowError && workflowError.code === '42P01') { // Table doesn't exist
				console.error('workflows table does not exist. Please run the CUSTOMIZATION_STUDIO_SCHEMA.sql in your Supabase dashboard.');
				throw new Error('Workflows table not found. Please run the CUSTOMIZATION_STUDIO_SCHEMA.sql script in your Supabase dashboard.');
			} else if (workflowError) {
				console.error('Error checking workflows table:', workflowError);
				throw new Error(`Workflows table error: ${workflowError.message}`);
			} else {
				console.log('Workflows table exists and is accessible');
			}

			// Test workflow table structure by trying to insert a test record
			try {
				console.log('Testing workflow table structure...');
				const testWorkflow = {
					name: 'TEST_WORKFLOW_DELETE_ME',
					description: 'Test workflow to verify table structure',
					trigger: 'test',
					actions: [],
					status: 'inactive',
					executions: 0
				};
				
				const { data: testData, error: testError } = await (supabase as any).from('workflows').insert(testWorkflow).select('*').single();
				
				if (testError) {
					console.error('Workflow table structure test failed:', testError);
					throw new Error(`Workflow table structure error: ${testError.message}`);
				} else {
					console.log('Workflow table structure test passed:', testData);
					// Clean up test record
					await (supabase as any).from('workflows').delete().eq('id', testData.id);
					console.log('Test workflow record cleaned up');
				}
			} catch (testError) {
				console.error('Error testing workflow table structure:', testError);
				throw testError;
			}
			
			return true;
		} catch (error) {
			console.error('Error initializing database:', error);
			throw error;
		}
	},

	// THEMES
	async listThemes(params?: { from?: number; to?: number; search?: string }): Promise<ThemeConfig[]> {
		return safeQuery<ThemeConfig[]>(
			(() => {
				let q = (supabase as any).from('themes').select('*').order('updated_at', { ascending: false });
				if (params?.search) {
					q = q.ilike('name', `%${params.search}%`);
				}
				if (params?.from !== undefined && params?.to !== undefined) q = q.range(params.from, params.to);
				return q;
			})(),
			[],
			'listThemes'
		);
	},

	async saveTheme(theme: ThemeConfig): Promise<ThemeConfig | null> {
		const now = new Date().toISOString();
		const payload = { ...theme, updated_at: now } as any;
		if (theme.id) {
			return safeQuery<ThemeConfig | null>(
				(supabase as any).from('themes').update(payload).eq('id', theme.id).select('*').single(),
				null,
				'updateTheme'
			);
		}
		return safeQuery<ThemeConfig | null>(
			(supabase as any).from('themes').insert(payload).select('*').single(),
			null,
			'createTheme'
		);
	},

	async uploadBrandAsset(file: File, pathPrefix: string): Promise<string | null> {
		try {
			const fileName = `${pathPrefix}/${Date.now()}-${file.name}`;
			const { error: upErr } = await (supabase as any).storage.from('brand-assets').upload(fileName, file, { upsert: true, contentType: file.type });
			if (upErr) throw upErr;
			const { data } = (supabase as any).storage.from('brand-assets').getPublicUrl(fileName);
			return data?.publicUrl || null;
		} catch (e) {
			console.warn('uploadBrandAsset failed', e);
			return null;
		}
	},

	// FORMS
	async listForms(params?: { from?: number; to?: number; search?: string }): Promise<any[]> {
		return safeQuery<any[]>(
			(() => {
				let q = (supabase as any).from('custom_forms').select('id,name,description,status,responses,last_modified').order('last_modified', { ascending: false });
				if (params?.search) {
					q = q.or(`name.ilike.%${params.search}%,description.ilike.%${params.search}%`);
				}
				if (params?.from !== undefined && params?.to !== undefined) q = q.range(params.from, params.to);
				return q;
			})(),
			[],
			'listForms'
		);
	},

	async createForm(form: { name: string; description: string }): Promise<any | null> {
		const payload = { ...form, status: 'draft', responses: 0, last_modified: new Date().toISOString() };
		return safeQuery<any | null>(
			(supabase as any).from('custom_forms').insert(payload).select('*').single(),
			null,
			'createForm'
		);
	},

	async deleteForm(id: string): Promise<boolean> {
		return safeQuery<boolean>(
			(supabase as any).from('custom_forms').delete().eq('id', id),
			true,
			'deleteForm'
		);
	},

	async updateForm(id: string, updates: any): Promise<any | null> {
		return safeQuery<any | null>(
			(supabase as any).from('custom_forms').update({ ...updates, last_modified: new Date().toISOString() }).eq('id', id).select('*').single(),
			null,
			'updateForm'
		);
	},

	// OBJECTS
	async listObjects(params?: { from?: number; to?: number; search?: string }): Promise<any[]> {
		return safeQuery<any[]>(
			(() => {
				let q = (supabase as any).from('custom_objects').select('*').order('updated_at', { ascending: false });
				if (params?.search) {
					q = q.or(`name.ilike.%${params.search}%,label.ilike.%${params.search}%`);
				}
				if (params?.from !== undefined && params?.to !== undefined) q = q.range(params.from, params.to);
				return q;
			})(),
			[],
			'listObjects'
		);
	},

	async createObject(obj: { name: string; label: string; description?: string }): Promise<any | null> {
		const payload = {
			...obj,
			fields_count: 0,
			records_count: 0,
			permissions: ['read'],
			relationships: 0,
			status: 'active',
			updated_at: new Date().toISOString()
		};
		return safeQuery<any | null>(
			(supabase as any).from('custom_objects').insert(payload).select('*').single(),
			null,
			'createObject'
		);
	},

	async updateObject(id: string, updates: any): Promise<any | null> {
		return safeQuery<any | null>(
			(supabase as any).from('custom_objects').update({ ...updates, updated_at: new Date().toISOString() }).eq('id', id).select('*').single(),
			null,
			'updateObject'
		);
	},

	async deleteObject(id: string): Promise<boolean> {
		return safeQuery<boolean>(
			(supabase as any).from('custom_objects').delete().eq('id', id),
			true,
			'deleteObject'
		);
	},

	async countObjects(search?: string): Promise<number> {
		try {
			let q = (supabase as any).from('custom_objects').select('*', { count: 'exact', head: true });
			if (search) q = q.or(`name.ilike.%${search}%,label.ilike.%${search}%`);
			const { count, error } = await q;
			if (error) throw error;
			return count || 0;
		} catch { return 0; }
	},

	async getObjectWithStats(id: string): Promise<any | null> {
		return safeQuery<any | null>(
			(async () => {
				const [object, fields, records] = await Promise.all([
					(supabase as any).from('custom_objects').select('*').eq('id', id).single(),
					(supabase as any).from('custom_fields').select('*', { count: 'exact', head: true }).eq('object', id),
					(supabase as any).from('custom_records').select('*', { count: 'exact', head: true }).eq('object_id', id)
				]);
				
				if (object.error) throw object.error;
				
				return {
					...object.data,
					fields_count: fields.count || 0,
					records_count: records.count || 0
				};
			})(),
			null,
			'getObjectWithStats'
		);
	},

	// OBJECT FIELDS
	async listObjectFields(objectId: string, params?: { from?: number; to?: number; search?: string }): Promise<any[]> {
		return safeQuery<any[]>(
			(() => {
				let q = (supabase as any).from('custom_fields').select('*').eq('object', objectId).order('created_at', { ascending: false });
				if (params?.search) q = q.or(`name.ilike.%${params.search}%,label.ilike.%${params.search}%`);
				if (params?.from !== undefined && params?.to !== undefined) q = q.range(params.from, params.to);
				return q;
			})(),
			[],
			'listObjectFields'
		);
	},

	async createObjectField(objectId: string, field: { name: string; label: string; type: string; required?: boolean; options?: string[] }): Promise<any | null> {
		const payload = {
			...field,
			object: objectId,
			required: !!field.required,
			options: field.options ?? [],
			created_at: new Date().toISOString()
		};
		return safeQuery<any | null>(
			(supabase as any).from('custom_fields').insert(payload).select('*').single(),
			null,
			'createObjectField'
		);
	},

	async updateObjectField(fieldId: string, updates: any): Promise<any | null> {
		return safeQuery<any | null>(
			(supabase as any).from('custom_fields').update({ ...updates, updated_at: new Date().toISOString() }).eq('id', fieldId).select('*').single(),
			null,
			'updateObjectField'
		);
	},

	async deleteObjectField(fieldId: string): Promise<boolean> {
		return safeQuery<boolean>(
			(supabase as any).from('custom_fields').delete().eq('id', fieldId),
			true,
			'deleteObjectField'
		);
	},

	async countObjectFields(objectId: string, search?: string): Promise<number> {
		try {
			let q = (supabase as any).from('custom_fields').select('*', { count: 'exact', head: true }).eq('object', objectId);
			if (search) q = q.or(`name.ilike.%${search}%,label.ilike.%${search}%`);
			const { count, error } = await q;
			if (error) throw error;
			return count || 0;
		} catch { return 0; }
	},

	// OBJECT RECORDS
	async listObjectRecords(objectId: string, params?: { from?: number; to?: number; search?: string }): Promise<any[]> {
		return safeQuery<any[]>(
			(() => {
				let q = (supabase as any).from('custom_records').select('*, custom_fields(*)').eq('object_id', objectId).order('created_at', { ascending: false });
				if (params?.search) q = q.or(`data->>name.ilike.%${params.search}%,data->>label.ilike.%${params.search}%`);
				if (params?.from !== undefined && params?.to !== undefined) q = q.range(params.from, params.to);
				return q;
			})(),
			[],
			'listObjectRecords'
		);
	},

	async createObjectRecord(objectId: string, data: any): Promise<any | null> {
		const payload = {
			object_id: objectId,
			data,
			created_at: new Date().toISOString()
		};
		return safeQuery<any | null>(
			(supabase as any).from('custom_records').insert(payload).select('*').single(),
			null,
			'createObjectRecord'
		);
	},

	async updateObjectRecord(recordId: string, data: any): Promise<any | null> {
		return safeQuery<any | null>(
			(supabase as any).from('custom_records').update({ data, updated_at: new Date().toISOString() }).eq('id', recordId).select('*').single(),
			null,
			'updateObjectRecord'
		);
	},

	async deleteObjectRecord(recordId: string): Promise<boolean> {
		return safeQuery<boolean>(
			(supabase as any).from('custom_records').delete().eq('id', recordId),
			true,
			'deleteObjectRecord'
		);
	},

	async countObjectRecords(objectId: string, search?: string): Promise<number> {
		try {
			let q = (supabase as any).from('custom_records').select('*', { count: 'exact', head: true }).eq('object_id', objectId);
			if (search) q = q.or(`data->>name.ilike.%${search}%,data->>label.ilike.%${search}%`);
			const { count, error } = await q;
			if (error) throw error;
			return count || 0;
		} catch { return 0; }
	},

	async listObjectRecordsForCustomer(objectId: string, customerId: string): Promise<any[]> {
		return safeQuery<any[]>(
			(supabase as any)
				.from('custom_records')
				.select('*')
				.eq('object_id', objectId)
				.filter('data->>customer_id', 'eq', customerId)
				.order('created_at', { ascending: false }),
			[],
			'listObjectRecordsForCustomer'
		);
	},

	// OBJECT RELATIONSHIPS
	async listObjectRelationships(objectId: string): Promise<any[]> {
		return safeQuery<any[]>(
			(supabase as any).from('object_relationships').select('*, target_object:custom_objects!target_object_id(*)').eq('source_object_id', objectId),
			[],
			'listObjectRelationships'
		);
	},

	async createObjectRelationship(relationship: { source_object_id: string; target_object_id: string; type: string; name: string }): Promise<any | null> {
		const payload = {
			...relationship,
			created_at: new Date().toISOString()
		};
		
		try {
			console.log('Creating relationship with payload:', payload);
			const result = await safeQuery<any | null>(
				(supabase as any).from('object_relationships').insert(payload).select('*').single(),
				null,
				'createObjectRelationship'
			);
			console.log('Relationship creation result:', result);
			return result;
		} catch (error) {
			console.error('Error creating relationship:', error);
			throw error;
		}
	},

	async deleteObjectRelationship(relationshipId: string): Promise<boolean> {
		return safeQuery<boolean>(
			(supabase as any).from('object_relationships').delete().eq('id', relationshipId),
			true,
			'deleteObjectRelationship'
		);
	},

	// FIELDS
	async listFields(params?: { from?: number; to?: number; search?: string }): Promise<any[]> {
		return safeQuery<any[]>(
			(() => {
				let q = (supabase as any).from('custom_fields').select('*').order('created_at', { ascending: false });
				if (params?.search) {
					q = q.or(`name.ilike.%${params.search}%,label.ilike.%${params.search}%,object.ilike.%${params.search}%`);
				}
				if (params?.from !== undefined && params?.to !== undefined) q = q.range(params.from, params.to);
				return q;
			})(),
			[],
			'listFields'
		);
	},

	async createField(field: { name: string; label: string; type: string; object: string; required?: boolean; options?: string[] }): Promise<any | null> {
		const payload = {
			...field,
			required: !!field.required,
			options: field.options ?? [],
			created_at: new Date().toISOString()
		};
		return safeQuery<any | null>(
			(supabase as any).from('custom_fields').insert(payload).select('*').single(),
			null,
			'createField'
		);
	},

	async listFieldsForObject(object: string): Promise<any[]> {
		return safeQuery<any[]>(
			(() => {
				const base = (supabase as any).from('custom_fields').select('*').order('created_at', { ascending: true });
				if (object === 'customers') {
					return base.in('object', ['customers','contacts']);
				}
				return base.eq('object', object);
			})(),
			[],
			'listFieldsForObject'
		);
	},

	async listFieldsForObjectPaged(object: string, params?: { from?: number; to?: number; search?: string }): Promise<any[]> {
		return safeQuery<any[]>(
			(() => {
				let q = (supabase as any).from('custom_fields').select('*').order('created_at', { ascending: false });
				if (object === 'customers') {
					q = q.in('object', ['customers','contacts']);
				} else {
					q = q.eq('object', object);
				}
				if (params?.search) q = q.or(`name.ilike.%${params.search}%,label.ilike.%${params.search}%`);
				if (params?.from !== undefined && params?.to !== undefined) q = q.range(params.from, params.to);
				return q;
			})(),
			[],
			'listFieldsForObjectPaged'
		);
	},

	async countFieldsForObject(object: string, search?: string): Promise<number> {
		try {
			let q = (supabase as any).from('custom_fields').select('*', { count: 'exact', head: true });
			if (object === 'customers') {
				q = q.in('object', ['customers','contacts']);
			} else {
				q = q.eq('object', object);
			}
			if (search) q = q.or(`name.ilike.%${search}%,label.ilike.%${search}%`);
			const { count, error } = await q;
			if (error) throw error;
			return count || 0;
		} catch { return 0; }
	},

	async updateField(id: string, updates: any): Promise<any | null> {
		return safeQuery<any | null>(
			(supabase as any).from('custom_fields').update(updates).eq('id', id).select('*').single(),
			null,
			'updateField'
		);
	},

	async deleteField(id: string): Promise<boolean> {
		return safeQuery<boolean>(
			(supabase as any).from('custom_fields').delete().eq('id', id),
			true,
			'deleteField'
		);
	},

	// WORKFLOWS
	async listWorkflows(params?: { from?: number; to?: number; search?: string }): Promise<any[]> {
		return safeQuery<any[]>(
			(() => {
				let q = (supabase as any).from('workflows').select('*').order('updated_at', { ascending: false });
				if (params?.search) {
					q = q.or(`name.ilike.%${params.search}%,trigger.ilike.%${params.search}%`);
				}
				if (params?.from !== undefined && params?.to !== undefined) q = q.range(params.from, params.to);
				return q;
			})(),
			[],
			'listWorkflows'
		);
	},

	async createWorkflow(workflow: { name: string; description?: string; trigger: string; actions: any[]; trigger_config?: any }): Promise<any | null> {
		try {
			console.log('Creating workflow with data:', workflow);
			
			const payload = {
				name: workflow.name,
				description: workflow.description || '',
				trigger: workflow.trigger,
				actions: workflow.actions || [],
				// trigger_config removed to match DB schema
				status: 'active',
				executions: 0,
				updated_at: new Date().toISOString()
			};
			
			console.log('Workflow payload:', payload);
			
			// Try direct Supabase call first to see the exact error
			const { data, error } = await (supabase as any).from('workflows').insert(payload).select('*').single();
			
			if (error) {
				console.error('Direct Supabase workflow creation error:', error);
				throw error;
			}
			
			console.log('Workflow creation result:', data);
			return data;
		} catch (error) {
			console.error('Error creating workflow:', error);
			throw error;
		}
	},

	async toggleWorkflow(id: string, status: 'active' | 'inactive'): Promise<any | null> {
		return safeQuery<any | null>(
			(supabase as any).from('workflows').update({ status }).eq('id', id).select('*').single(),
			null,
			'toggleWorkflow'
		);
	},

	async updateWorkflow(id: string, updates: any): Promise<any | null> {
		return safeQuery<any | null>(
			(supabase as any).from('workflows').update({ ...updates, updated_at: new Date().toISOString() }).eq('id', id).select('*').single(),
			null,
			'updateWorkflow'
		);
	},

	async deleteWorkflow(id: string): Promise<boolean> {
		return safeQuery<boolean>(
			(supabase as any).from('workflows').delete().eq('id', id),
			true,
			'deleteWorkflow'
		);
	},

	// INTEGRATIONS
	async listIntegrations(params?: { from?: number; to?: number; search?: string }): Promise<any[]> {
		return safeQuery<any[]>(
			(() => {
				let q = (supabase as any).from('integrations').select('*').order('updated_at', { ascending: false });
				if (params?.search) {
					q = q.or(`name.ilike.%${params.search}%,provider.ilike.%${params.search}%,category.ilike.%${params.search}%`);
				}
				if (params?.from !== undefined && params?.to !== undefined) q = q.range(params.from, params.to);
				return q;
			})(),
			[],
			'listIntegrations'
		);
	},

	async toggleIntegration(id: string, status: 'connected' | 'disconnected'): Promise<any | null> {
		return safeQuery<any | null>(
			(supabase as any).from('integrations').update({ status, updated_at: new Date().toISOString() }).eq('id', id).select('*').single(),
			null,
			'toggleIntegration'
		);
	},

	async updateIntegration(id: string, updates: any): Promise<any | null> {
		return safeQuery<any | null>(
			(supabase as any).from('integrations').update({ ...updates, updated_at: new Date().toISOString() }).eq('id', id).select('*').single(),
			null,
			'updateIntegration'
		);
	},

	async createIntegration(integration: { name: string; provider: string; category: string; description?: string; status?: 'connected'|'disconnected'|'error' }): Promise<any | null> {
		return safeQuery<any | null>(
			(supabase as any).from('integrations').insert({ ...integration, status: integration.status ?? 'disconnected', updated_at: new Date().toISOString() }).select('*').single(),
			null,
			'createIntegration'
		);
	},

	// DISPOSITIONS
	async listDispositions(): Promise<any[]> {
		return safeQuery<any[]>(
			(supabase as any).from('dispositions').select('*').eq('is_active', true).order('category', { ascending: true }),
			[],
			'listDispositions'
		);
	},

	async listDispositionFields(dispositionKey: string): Promise<any[]> {
		return safeQuery<any[]>(
			(supabase as any).from('disposition_fields').select('*').eq('disposition_key', dispositionKey).order('created_at', { ascending: true }),
			[],
			'listDispositionFields'
		);
	},

	// COUNTS
	async countForms(search?: string): Promise<number> {
		try {
			let q = (supabase as any).from('custom_forms').select('*', { count: 'exact', head: true });
			if (search) q = q.or(`name.ilike.%${search}%,description.ilike.%${search}%`);
			const { count, error } = await q;
			if (error) throw error;
			return count || 0;
		} catch {
			return 0;
		}
	},

	async countFields(search?: string): Promise<number> {
		try {
			let q = (supabase as any).from('custom_fields').select('*', { count: 'exact', head: true });
			if (search) q = q.or(`name.ilike.%${search}%,label.ilike.%${search}%,object.ilike.%${search}%`);
			const { count, error } = await q;
			if (error) throw error;
			return count || 0;
		} catch { return 0; }
	},

	async countWorkflows(search?: string): Promise<number> {
		try {
			let q = (supabase as any).from('workflows').select('*', { count: 'exact', head: true });
			if (search) q = q.or(`name.ilike.%${search}%,trigger.ilike.%${search}%`);
			const { count, error } = await q;
			if (error) throw error;
			return count || 0;
		} catch { return 0; }
	},

	async countIntegrations(search?: string): Promise<number> {
		try {
			let q = (supabase as any).from('integrations').select('*', { count: 'exact', head: true });
			if (search) q = q.or(`name.ilike.%${search}%,provider.ilike.%${search}%,category.ilike.%${search}%`);
			const { count, error } = await q;
			if (error) throw error;
			return count || 0;
		} catch { return 0; }
	},

	// SCRIPTS
	async listScripts(params?: { from?: number; to?: number; search?: string }): Promise<any[]> {
		return safeQuery<any[]>(
			(() => {
				let q = (supabase as any).from('custom_scripts').select('*').order('updated_at', { ascending: false });
				if (params?.search) {
					q = q.or(`name.ilike.%${params.search}%,language.ilike.%${params.search}%`);
				}
				if (params?.from !== undefined && params?.to !== undefined) q = q.range(params.from, params.to);
				return q;
			})(),
			[],
			'listScripts'
		);
	},

	async createScript(script: { name: string; description?: string; language: string; trigger: string; code: string; environment: string }): Promise<any | null> {
		const payload = { ...script, status: 'active', executions: 0, updated_at: new Date().toISOString() };
		return safeQuery<any | null>(
			(supabase as any).from('custom_scripts').insert(payload).select('*').single(),
			null,
			'createScript'
		);
	},

	async runScript(id: string): Promise<boolean> {
		// For now, just log execution in DB if table exists
		return safeQuery<boolean>(
			(supabase as any).from('custom_scripts').update({ executions: (supabase as any).rpc ? undefined : undefined }).eq('id', id),
			true,
			'runScript-mark'
		);
	},

	// DISPOSITIONS CRUD
	async createDisposition(dispo: { key: string; name: string; category: string; description?: string; is_active?: boolean }): Promise<any | null> {
		return safeQuery<any | null>(
			(supabase as any).from('dispositions').insert({ ...dispo, is_active: dispo.is_active ?? true }).select('*').single(),
			null,
			'createDisposition'
		);
	},

	async updateDisposition(key: string, updates: any): Promise<any | null> {
		return safeQuery<any | null>(
			(supabase as any).from('dispositions').update(updates).eq('key', key).select('*').single(),
			null,
			'updateDisposition'
		);
	},

	async deleteDisposition(key: string): Promise<boolean> {
		return safeQuery<boolean>(
			(supabase as any).from('dispositions').delete().eq('key', key),
			true,
			'deleteDisposition'
		);
	},

	async createDispositionField(field: { disposition_key: string; name: string; type: string; label: string; required?: boolean; options?: string[]; placeholder?: string }): Promise<any | null> {
		return safeQuery<any | null>(
			(supabase as any).from('disposition_fields').insert({ ...field, required: !!field.required }).select('*').single(),
			null,
			'createDispositionField'
		);
	},

	async updateDispositionField(id: string, updates: any): Promise<any | null> {
		return safeQuery<any | null>(
			(supabase as any).from('disposition_fields').update(updates).eq('id', id).select('*').single(),
			null,
			'updateDispositionField'
		);
	},

	async deleteDispositionField(id: string): Promise<boolean> {
		return safeQuery<boolean>(
			(supabase as any).from('disposition_fields').delete().eq('id', id),
			true,
			'deleteDispositionField'
		);
	},

	// OBJECT PLACEMENTS
	async listObjectPlacements(params?: { destination?: string }): Promise<any[]> {
		return safeQuery<any[]>(
			(() => {
				let q = (supabase as any).from('object_placements').select('*, object:custom_objects(*)').order('sort_order', { ascending: true });
				if (params?.destination) q = q.eq('destination', params.destination);
				return q;
			})(),
			[],
			'listObjectPlacements'
		);
	},

	async createObjectPlacement(payload: { object_id: string; destination: string; section_label: string; link_key: string; include_fields?: string[]; sort_order?: number; is_active?: boolean }): Promise<any | null> {
		return safeQuery<any | null>(
			(supabase as any).from('object_placements').insert({
				...payload,
				include_fields: payload.include_fields ?? null,
				sort_order: payload.sort_order ?? 0,
				is_active: payload.is_active ?? true
			}).select('*').single(),
			null,
			'createObjectPlacement'
		);
	},

	async updateObjectPlacement(id: string, updates: any): Promise<any | null> {
		return safeQuery<any | null>(
			(supabase as any).from('object_placements').update(updates).eq('id', id).select('*').single(),
			null,
			'updateObjectPlacement'
		);
	},

	async deleteObjectPlacement(id: string): Promise<boolean> {
		return safeQuery<boolean>(
			(supabase as any).from('object_placements').delete().eq('id', id),
			true,
			'deleteObjectPlacement'
		);
	},
}; 