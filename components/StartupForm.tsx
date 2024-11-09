"use client";

import { useActionState, useState } from "react";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import MDEditor from "@uiw/react-md-editor";
import { Button } from "./ui/button";
import { Send } from "lucide-react";
import { formSchema } from "@/lib/validation";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { createPitch } from "@/lib/actions";

const StartupForm = () => {

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [link, setLink] = useState("");
  const [pitch, setPitch] = useState("");
  const { toast } = useToast()
  const router = useRouter();

  const handleFormSubmit = async (prevState: unknown, formData: FormData) => {
    try {
      const formValues = {
        title: formData.get("title") as string,
        description: formData.get("description") as string,
        category: formData.get("category") as string,
        link: formData.get("link") as string,
        pitch,
      }
      await formSchema.parseAsync(formValues);
      const result = await createPitch(prevState, formData, pitch)
      if (result.status === "SUCCESS") {
        toast({ title: "Success", description: "Your startup pitch has been created successfully" })
        router.push(`/startup/${result._id}`)
      }
      return result;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const FieldErrors = error.flatten().fieldErrors;
        setErrors(FieldErrors as unknown as Record<string, string>);
        toast({ title: "Error", description: "Please check your inputs and try again", variant: "destructive" })
        return { prevState, error: "Validation failed", status: "ERROR" };
      } else {
        toast({ title: "Error", description: "An unexpected error occurred", variant: "destructive" })
        return { prevState, error: "An unexpected error occurred", status: "ERROR" };
      }
      console.log(error);
    }
  }

  const [state, formAction, isPending] = useActionState(handleFormSubmit, { error: "", status: "INITIAL" });

  return (
    <form action={formAction} className="startup-form">
      <div>
        <label htmlFor="title" className="startup-form_label">
          Title
        </label>
        <Input value={title} onChange={(event) => setTitle(event.target.value as string)} id="title" name="title" className="startup-form_input" required placeholder="Startup Title" type="text" />
        {errors.title && <p className="startup-form_error">
          {errors.title}
        </p>}
      </div>

      <div>
        <label htmlFor="description" className="startup-form_label">
          Description
        </label>
        <Textarea value={description} onChange={(event) => setDescription(event.target.value as string)} id="description" name="description" className="startup-form_textarea" required placeholder="Startup Description" />
        {errors.description && <p className="startup-form_error">
          {errors.description}
        </p>}
      </div>

      <div>
        <label htmlFor="category" className="startup-form_label">
          Category
        </label>
        <Input value={category} onChange={(event) => setCategory(event.target.value as string)} id="category" name="category" className="startup-form_input" required placeholder="Startup Category (Tech, Health, Education)" type="text" />
        {errors.category && <p className="startup-form_error">
          {errors.category}
        </p>}
      </div>

      <div>
        <label htmlFor="link" className="startup-form_label">
          Image URL
        </label>
        <Input value={link} onChange={(event) => setLink(event.target.value as string)} id="link" name="link" className="startup-form_input" required placeholder="Startup Image URL" type="text" />
        {errors.link && <p className="startup-form_error">
          {errors.link}
        </p>}
      </div>

      <div data-color-mode="light">
        <label htmlFor="pitch" className="startup-form_label">
          Pitch
        </label>
        <MDEditor
          value={pitch}
          onChange={(value) => setPitch(value as string)}
          id="pitch"
          preview="edit"
          height={300}
          style={{
            borderRadius: 20, overflow: "hidden"
          }}
          textareaProps={{
            placeholder: "Briefly describe your idea and what problem it solves",
          }}
          previewOptions={{
            disallowedElements: ["style"]
          }}
        />
        {errors.pitch && <p className="startup-form_error">
          {errors.pitch}
        </p>}
      </div>
      <Button type="submit" className="startup-form_btn text-white" disabled={isPending}>
        {isPending ? "Submitting..." : "Submit Your Startup"}
        <Send className="size-6 ml-2" />
      </Button>

    </form>
  )
}

export default StartupForm