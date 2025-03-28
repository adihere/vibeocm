'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { FormField, FormItem, FormLabel, FormControl, FormMessage, Form } from '@/components/ui/form'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'

const formSchema = z.object({
  name: z.string().min(2, { message: 'Project name must be at least 2 characters' }),
  goal: z.string().min(20, { message: 'Please provide a more detailed project goal' }),
  startDate: z.string().min(1, { message: 'Start date is required' }),
  endDate: z.string().min(1, { message: 'End date is required' })
})

interface ProjectBasicsFormProps {
  initialData: {
    name: string
    goal: string
    startDate: string
    endDate: string
  }
  onSubmit: (data: {
    name: string
    goal: string
    startDate: string
    endDate: string
  }) => void
}

export function ProjectBasicsForm({ initialData, onSubmit }: ProjectBasicsFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: initialData.name || '',
      goal: initialData.goal || '',
      startDate: initialData.startDate || '',
      endDate: initialData.endDate || ''
    }
  })
  
  function handleSubmit(values: z.infer<typeof formSchema>) {
    onSubmit(values)
  }
  
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Step 1: Project Basics</h2>
        <p className="text-muted-foreground mt-2">
          Provide basic information about your change initiative.
        </p>
      </div>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Project Name</FormLabel>
                <FormControl>
                  <Input placeholder="e.g., CRM System Migration" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="goal"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Project Goal</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Describe the main objective of this change initiative..." 
                    rows={4}
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="startDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Start Date</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="endDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>End Date</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <div className="pt-4">
            <Button type="submit" className="w-full">Continue to Step 2</Button>
          </div>
        </form>
      </Form>
    </div>
  )
}

