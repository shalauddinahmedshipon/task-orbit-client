"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

import { toast } from "sonner";

import {
  createProjectSchema,
  CreateProjectInput,
} from "@/lib/validations/project.schema";

import {
  useCreateProjectMutation,
  useUpdateProjectMutation,
} from "@/store/api/project.api";

import type { Project } from "@/types/project.types";

interface Props {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  editProject?: Project | null;
}

const defaultValues: CreateProjectInput = {
  title: "",
  client: "",
  description: "",
  startDate: "",
  endDate: "",
  budget: 0,
  status: "planned",
  thumbnail: undefined,
};

export function CreateProjectModal({
  open,
  onOpenChange,
  editProject,
}: Props) {
  const isEdit = !!editProject;

  const [createProject, { isLoading: creating }] =
    useCreateProjectMutation();

  const [updateProject, { isLoading: updating }] =
    useUpdateProjectMutation();

  const isLoading = creating || updating;

  const form = useForm<CreateProjectInput>({
    resolver: zodResolver(createProjectSchema),
    defaultValues,
  });

  /* -------------------------------------------------------
     Reset / Populate Form
  ------------------------------------------------------- */
  useEffect(() => {
    // Edit Mode
    if (editProject) {
      form.reset({
        title: editProject.title,
        client: editProject.client,
        description: editProject.description,
        startDate: editProject.startDate.slice(0, 10),
        endDate: editProject.endDate.slice(0, 10),
        budget: editProject.budget,
        status: editProject.status,
        thumbnail: undefined,
      });
    }

    // Create Mode
    else if (open) {
      form.reset(defaultValues);
    }
  }, [editProject, open, form]);

  /* -------------------------------------------------------
     Submit
  ------------------------------------------------------- */
  const onSubmit = async (values: CreateProjectInput) => {
    try {
      const formData = new FormData();

      Object.entries(values).forEach(([key, value]) => {
        if (
          value !== undefined &&
          value !== null
        ) {
          formData.append(key, value as any);
        }
      });

      if (isEdit && editProject) {
        await updateProject({
          projectId: editProject._id,
          body: formData,
        }).unwrap();

        toast.success(
          "Project updated successfully"
        );
      } else {
        await createProject(formData).unwrap();

        toast.success(
          "Project created successfully"
        );
      }

      form.reset(defaultValues);

      onOpenChange(false);
    } catch (err: any) {
      toast.error(
        err?.data?.message ??
          "Something went wrong"
      );
    }
  };

  /* -------------------------------------------------------
     Close Modal
  ------------------------------------------------------- */
  const handleClose = () => {
    form.reset(defaultValues);
    onOpenChange(false);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        if (!v) {
          handleClose();
        } else {
          onOpenChange(v);
        }
      }}
    >
      <DialogContent className="max-w-lg w-full max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEdit
              ? "Edit Project"
              : "Create New Project"}
          </DialogTitle>

          <DialogDescription>
            {isEdit
              ? "Update the project details below."
              : "Fill in the details to create a new project."}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 pt-2"
          >
            {/* ------------------------------------------------ */}
            {/* Title */}
            {/* ------------------------------------------------ */}

            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Project Title
                  </FormLabel>

                  <FormControl>
                    <Input
                      placeholder="E-Commerce Redesign"
                      {...field}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            {/* ------------------------------------------------ */}
            {/* Client */}
            {/* ------------------------------------------------ */}

            <FormField
              control={form.control}
              name="client"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Client
                  </FormLabel>

                  <FormControl>
                    <Input
                      placeholder="DataPollex Ltd."
                      {...field}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            {/* ------------------------------------------------ */}
            {/* Description */}
            {/* ------------------------------------------------ */}

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Description
                  </FormLabel>

                  <FormControl>
                    <Textarea
                      placeholder="Describe the project scope and goals..."
                      className="resize-none"
                      rows={4}
                      {...field}
                    />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            {/* ------------------------------------------------ */}
            {/* Dates */}
            {/* ------------------------------------------------ */}

            <div className="grid grid-cols-2 gap-3">
              <FormField
                control={form.control}
                name="startDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Start Date
                    </FormLabel>

                    <FormControl>
                      <Input
                        type="date"
                        {...field}
                      />
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
                    <FormLabel>
                      End Date
                    </FormLabel>

                    <FormControl>
                      <Input
                        type="date"
                        {...field}
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* ------------------------------------------------ */}
            {/* Budget + Status */}
            {/* ------------------------------------------------ */}

            <div className="grid grid-cols-2 gap-3">
              <FormField
                control={form.control}
                name="budget"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Budget (USD)
                    </FormLabel>

                    <FormControl>
                      <Input
                        type="number"
                        min={0}
                        placeholder="48000"
                        value={
                          field.value ?? ""
                        }
                        onChange={(e) => {
                          const value =
                            e.target.value;

                          field.onChange(
                            value === ""
                              ? 0
                              : Number(value)
                          );
                        }}
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Status
                    </FormLabel>

                    <Select
                      value={field.value}
                      onValueChange={
                        field.onChange
                      }
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                      </FormControl>

                      <SelectContent>
                        <SelectItem value="planned">
                          Planned
                        </SelectItem>

                        <SelectItem value="active">
                          Active
                        </SelectItem>

                        <SelectItem value="completed">
                          Completed
                        </SelectItem>

                        <SelectItem value="archived">
                          Archived
                        </SelectItem>
                      </SelectContent>
                    </Select>

                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* ------------------------------------------------ */}
            {/* Thumbnail */}
            {/* ------------------------------------------------ */}

           <FormField
  control={form.control}
  name="thumbnail"
  render={({ field }) => (
    <FormItem>
      <FormLabel>Thumbnail (optional)</FormLabel>

      <FormControl>
        <Input
          type="file"
          accept="image/*"
          className="cursor-pointer"
          onChange={(e) => {
            const file = e.target.files?.[0];

            field.onChange(file || undefined);
          }}
        />
      </FormControl>

      {/* Selected filename */}
      {field.value instanceof File && (
        <p className="text-xs text-muted-foreground">
          Selected: {field.value.name}
        </p>
      )}

      <p className="text-xs text-muted-foreground">
        PNG, JPG up to 4MB
      </p>

      <FormMessage />
    </FormItem>
  )}
/>

            {/* ------------------------------------------------ */}
            {/* Actions */}
            {/* ------------------------------------------------ */}

            <div className="flex justify-end gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={handleClose}
                disabled={isLoading}
              >
                Cancel
              </Button>

              <Button
                type="submit"
                disabled={isLoading}
              >
                {isLoading && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}

                {isEdit
                  ? "Save Changes"
                  : "Create Project"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

// "use client";

// import { useEffect } from "react";
// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { Loader2 } from "lucide-react";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogDescription,
// } from "@/components/ui/dialog";
// import {
//   Form,
//   FormControl,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from "@/components/ui/form";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { Input } from "@/components/ui/input";
// import { Textarea } from "@/components/ui/textarea";
// import { Button } from "@/components/ui/button";
// import { toast } from "sonner";
// import { createProjectSchema, CreateProjectInput } from "@/lib/validations/project.schema";
// import { useCreateProjectMutation, useUpdateProjectMutation } from "@/store/api/project.api";
// import type { Project } from "@/types/project.types";

// interface Props {
//   open: boolean;
//   onOpenChange: (v: boolean) => void;
//   /** If provided, form operates in edit mode */
//   editProject?: Project | null;
// }

// export function CreateProjectModal({ open, onOpenChange, editProject }: Props) {
//   const isEdit = !!editProject;
//   const [createProject, { isLoading: creating }] = useCreateProjectMutation();
//   const [updateProject, { isLoading: updating }] = useUpdateProjectMutation();
//   const isLoading = creating || updating;

//   const form = useForm<CreateProjectInput>({
//     resolver: zodResolver(createProjectSchema),
//     defaultValues: {
//       title: "",
//       client: "",
//       description: "",
//       startDate: "",
//       endDate: "",
//       budget: 0,
//       status: "planned",
//     },
//   });

//   // Populate form when editing
//   useEffect(() => {
//     if (editProject) {
//       form.reset({
//         title: editProject.title,
//         client: editProject.client,
//         description: editProject.description,
//         startDate: editProject.startDate.slice(0, 10),
//         endDate: editProject.endDate.slice(0, 10),
//         budget: editProject.budget,
//         status: editProject.status,
//       });
//     } else {
//       form.reset();
//     }
//   }, [editProject, form]);

//   const onSubmit = async (values: CreateProjectInput) => {
//     const formData = new FormData();
//    Object.entries(values).forEach(([key, value]) => {
//   if (value !== undefined && value !== null) {
//     formData.append(key, value as any)
//   }
// })

//     try {
//       if (isEdit && editProject) {
//         await updateProject({ projectId: editProject._id, body: formData }).unwrap();
//         toast.success("Project updated successfully");
//       } else {
//         await createProject(formData).unwrap();
//         toast.success("Project created successfully");
//       }
//       onOpenChange(false);
//       form.reset();
//     } catch (err: any) {
//       toast.error(err?.data?.message ?? "Something went wrong");
//     }
//   };

//   return (
//     <Dialog open={open} onOpenChange={onOpenChange}>
//       <DialogContent className="max-w-lg w-full max-h-[90vh] overflow-y-auto">
//         <DialogHeader>
//           <DialogTitle>{isEdit ? "Edit Project" : "Create New Project"}</DialogTitle>
//           <DialogDescription>
//             {isEdit
//               ? "Update the project details below."
//               : "Fill in the details to create a new project."}
//           </DialogDescription>
//         </DialogHeader>

//         <Form {...form}>
//           <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-2">
//             {/* Title */}
//             <FormField
//               control={form.control}
//               name="title"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>Project Title</FormLabel>
//                   <FormControl>
//                     <Input placeholder="E-Commerce Redesign" {...field} />
//                   </FormControl>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />

//             {/* Client */}
//             <FormField
//               control={form.control}
//               name="client"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>Client</FormLabel>
//                   <FormControl>
//                     <Input placeholder="DataPollex Ltd." {...field} />
//                   </FormControl>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />

//             {/* Description */}
//             <FormField
//               control={form.control}
//               name="description"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>Description</FormLabel>
//                   <FormControl>
//                     <Textarea
//                       placeholder="Describe the project scope and goals…"
//                       className="resize-none"
//                       rows={3}
//                       {...field}
//                     />
//                   </FormControl>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />

//             {/* Start / End dates */}
//             <div className="grid grid-cols-2 gap-3">
//               <FormField
//                 control={form.control}
//                 name="startDate"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>Start Date</FormLabel>
//                     <FormControl>
//                       <Input type="date" {...field} />
//                     </FormControl>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />
//               <FormField
//                 control={form.control}
//                 name="endDate"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>End Date</FormLabel>
//                     <FormControl>
//                       <Input type="date" {...field} />
//                     </FormControl>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />
//             </div>

//             {/* Budget / Status */}
//             <div className="grid grid-cols-2 gap-3">
//               <FormField
//                 control={form.control}
//                 name="budget"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>Budget (USD)</FormLabel>
//                     <FormControl>
//                      <Input
//   type="number"
//   min={0}
//   placeholder="48000"
//   value={field.value ?? ""}
//   onChange={(e) => {
//     const value = e.target.value

//     field.onChange(value === "" ? 0 : Number(value))
//   }}
// />
//                     </FormControl>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />
//               <FormField
//                 control={form.control}
//                 name="status"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>Status</FormLabel>
//                     <Select
//                       value={field.value}
//                       onValueChange={field.onChange}
//                     >
//                       <FormControl>
//                         <SelectTrigger>
//                           <SelectValue placeholder="Select status" />
//                         </SelectTrigger>
//                       </FormControl>
//                       <SelectContent>
//                         <SelectItem value="planned">Planned</SelectItem>
//                         <SelectItem value="active">Active</SelectItem>
//                         <SelectItem value="completed">Completed</SelectItem>
//                         <SelectItem value="archived">Archived</SelectItem>
//                       </SelectContent>
//                     </Select>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />
//             </div>

//             {/* Thumbnail upload (optional) */}
//             <div className="space-y-1.5">
//               <FormField
//   control={form.control}
//   name="thumbnail"
//   render={({ field }) => (
//     <FormItem>
//       <FormLabel>Thumbnail (optional)</FormLabel>

//       <FormControl>
//         <Input
//           type="file"
//           accept="image/*"
//           onChange={(e) => {
//             const file = e.target.files?.[0]

//             if (file) {
//               field.onChange(file)
//             }
//           }}
//         />
//       </FormControl>

//       <FormMessage />
//     </FormItem>
//   )}
// />
//             </div>

//             {/* Actions */}
//             <div className="flex justify-end gap-2 pt-2">
//               <Button
//                 type="button"
//                 variant="outline"
//                 onClick={() => onOpenChange(false)}
//                 disabled={isLoading}
//               >
//                 Cancel
//               </Button>
//               <Button type="submit" disabled={isLoading}>
//                 {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
//                 {isEdit ? "Save Changes" : "Create Project"}
//               </Button>
//             </div>
//           </form>
//         </Form>
//       </DialogContent>
//     </Dialog>
//   );
// }
