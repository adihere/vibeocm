'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { FormField, FormItem, FormLabel, FormControl, FormMessage, Form } from '@/components/ui/form'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Plus, Trash } from 'lucide-react'

const stakeholderSchema = z.object({
  role: z.string().min(2, { message: 'Role must be at least 2 characters' }),
  impact: z.string().min(2, { message: 'Impact must be at least 2 characters' })
})

const formSchema = z.object({
  stakeholders: z.array(stakeholderSchema).min(1, { message: 'At least one stakeholder is required' }),
  impactedUsers: z.number().min(1, { message: 'Number of impacted users must be at least 1' })
})

interface StakeholdersFormProps {
  initialData: {
    stakeholders: { role: string; impact: string }[]
    impactedUsers: number
  }
  onSubmit: (data: {
    stakeholders: { role: string; impact: string }[]
    impactedUsers: number
  }) => void
  onBack: () => void
}

export function StakeholdersForm({ initialData, onSubmit, onBack }: StakeholdersFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      stakeholders: initialData.stakeholders.length > 0 
        ? initialData.stakeholders 
        : [{ role: '', impact: '' }],
      impactedUsers: initialData.impactedUsers || 0
    }
  })
  
  const { fields, append, remove } = form.useFieldArray({
    name: "stakeholders"
  })
  
  function handleSubmit(values: z.infer<typeof formSchema>) {
    onSubmit(values)
  }
  
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Step 2: Stakeholders</h2>
        <p className="text-muted-foreground mt-2">
          Identify the key stakeholders affected by this change.
        </p>
      </div>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <Label>Stakeholders and Roles</Label>
              <Button 
                type="button" 
                variant="outline" 
                size="sm" 
                onClick={() => append({ role: '', impact: '' })}
              >
                <Plus className="h-4 w-4 mr-2" /> Add Stakeholder
              </Button>
            </div>
            
            {fields.map((field, index) => (
              <div key={field.id} className="flex gap-4 items-start">
                <div className="flex-1">
                  <FormField
                    control={form.control}
                    name={`stakeholders.${index}.role`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className={index !== 0 ? "sr-only" : undefined}>Role/Group</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., Sales Team" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="flex-1">
                  <FormField
                    control={form.control}
                    name={`stakeholders.${index}.impact`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className={index !== 0 ? "sr-only" : undefined}>Impact</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., High - Daily workflow changes" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                {fields.length > 1 && (
                  <Button 
                    type="button" 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => remove(index)}
                    className="mt-8"
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
          </div>
          
          <FormField
            control={form.control}
            name="impactedUsers"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Estimated Number of Impacted Users</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    min="1"
                    {...field}
                    onChange={e => field.onChange(parseInt(e.target.value) || 0)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <div className="flex justify-between pt-4">
            <Button type="button" variant="outline" onClick={onBack}>
              Back
            </Button>
            <Button type="submit">Continue to Step 3</Button>
          </div>
        </form>
      </Form>
    </div>
  )
}

