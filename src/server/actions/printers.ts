'use server'

import { createUserClient } from '@/lib/supabase/server'

/**
 * Get user's printers
 */
export async function getUserPrinters() {
  try {
    const { supabase, session } = await createUserClient()

    if (!session?.user) {
      return { success: false, error: 'Not authenticated', data: [] }
    }

    const { data, error } = await supabase
      .from('printers')
      .select('*')
      .eq('user_id', session.user.id)
      .order('is_default', { ascending: false })
      .order('name', { ascending: true })

    if (error) {
      return { success: false, error: error.message, data: [] }
    }

    return { success: true, data: data || [] }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to get printers',
      data: [],
    }
  }
}

/**
 * Get printer by ID
 */
export async function getPrinterById(printerId: string) {
  try {
    const { supabase, session } = await createUserClient()

    if (!session?.user) {
      return { success: false, error: 'Not authenticated', data: null }
    }

    const { data, error } = await supabase
      .from('printers')
      .select('*')
      .eq('id', printerId)
      .eq('user_id', session.user.id)
      .single()

    if (error) {
      return { success: false, error: error.message, data: null }
    }

    return { success: true, data }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to get printer',
      data: null,
    }
  }
}

/**
 * Set default printer
 */
export async function setDefaultPrinter(printerId: string) {
  try {
    const { supabase, session } = await createUserClient()

    if (!session?.user) {
      return { success: false, error: 'Not authenticated' }
    }

    // First, unset all other default printers for this user
    await supabase
      .from('printers')
      .update({ is_default: false })
      .eq('user_id', session.user.id)

    // Then set this one as default
    const { error } = await supabase
      .from('printers')
      .update({ is_default: true })
      .eq('id', printerId)
      .eq('user_id', session.user.id)

    if (error) {
      return { success: false, error: error.message }
    }

    return { success: true }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to set default printer',
    }
  }
}

/**
 * Delete printer
 */
export async function deletePrinter(printerId: string) {
  try {
    const { supabase, session } = await createUserClient()

    if (!session?.user) {
      return { success: false, error: 'Not authenticated' }
    }

    const { error } = await supabase
      .from('printers')
      .delete()
      .eq('id', printerId)
      .eq('user_id', session.user.id)

    if (error) {
      return { success: false, error: error.message }
    }

    return { success: true }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to delete printer',
    }
  }
}

