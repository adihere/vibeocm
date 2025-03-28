'use client'

import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { FormField, FormItem, FormLabel, FormControl, FormMessage, Form } from '@/components/ui/form'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'

const formSchema = z.object({
  orgBenefits: z.string().min(20, { message: 'Please provide more details about organizational benefits' }),
  userBenefits: z.string().min(20, { message: 'Please provide more details about user benefits' }),
  challenges: z.string().min(20, { message: 'Please provide more details about expected challenges' })
})

interface BenefitsFormProps {
  initialData: {
    orgBenefits: string
    userBenefits: string
    challenges: string
  }
  onSubmit: (data: {
    orgBenefits: string
    userBenefits: string
    challenges: string
  }) => void
  onBack: () => void
}

export function BenefitsForm({ initialData, onSubmit, onBack }: BenefitsFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      orgBenefits: initialData.orgBenefits || '',
      userBenefits: initialData.userBenefits || '',
      challenges: initialData.challenges || ''
    }
  })
  
  function handleSubmit(values: z.infer<typeof formSchema>) {
    onSubmit(values)
  }
  
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Step 3: Benefits & Challenges</h2>
        <p className="text-muted-foreground mt-2">
          Describe the benefits and challenges associated with this change.
        </p>
      </div>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="orgBenefits"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Benefits to Organization</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Describe how this change will benefit the organization..." 
                    rows={4}
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="userBenefits"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Benefits to End Users</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Describe how this change will benefit the end users..." 
                    rows={4}
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="challenges"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Expected Challenges</FormLabel>
                <FormControl>
                  <Textarea 
                    placeholder="Describe any anticipated challenges or resistance..." 
                    rows={4}
                    {...field} 
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
            <Button type="submit">Continue to Artifact Selection</Button>
          </div>
        </form>
      </Form>
    </div>
  )
}

