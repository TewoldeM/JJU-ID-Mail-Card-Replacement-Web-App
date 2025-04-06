"use client";
import "react-phone-number-input/style.css";
import React, { useState } from "react";
import { z } from "zod";
import PhoneInput from "react-phone-number-input";
import { E164Number } from "libphonenumber-js/core";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import DatePicker from "@/components/collection/ReusableComponets/DatePicker";
import { Collages, Departments, Programs, Reasons } from "@/app/lib/contants/constants-IdCrad-R";
import Fileuploadform from "./ReusableComponets/Fileuploadform";
import { cn } from "@/lib/utils";


const MailCardForm = () => {
    const formSchema = z.object({
      FirstName: z.string().min(2).max(50),
      LastName: z.string().min(2).max(50),
      Phone: z.string().min(10).max(20),
      Email: z.string(),
      Collage: z.string().min(2).max(50),
      Department: z.string().min(2).max(50),
      Year: z.string().min(2).max(50),
      Program: z.string().min(2).max(50),
    });

    // 1. Define your form.
    const form = useForm<z.infer<typeof formSchema>>({
      resolver: zodResolver(formSchema),
      defaultValues: {
        FirstName: "",
        LastName: "",
        Phone: "",
        Email: "",
        Collage: "",
        Department: "",
        Year: "",
        Program: "",
      },
    });
    // 2. Define a submit handler.
    function onSubmit(values: z.infer<typeof formSchema>) {
      // Do something with the form values.
      // ✅ This will be type-safe and validated.
      console.log(values);
    }
    // function cn(...classes: string[]): string {
    //   return classes.filter(Boolean).join(" ");
    // }
    const handleMaxChange = (value: string) => {
      setSelectedMax(value);
    };
      const [checked, setChecked] = useState(false);
      const [selectedMax, setSelectedMax] = useState<string>("");
  return (
    <div className="flex flex-col items-center gap-14">
      <div className="flex flex-col gap-4 mt-12 px-7">
        <h1 className="text-6xl">Application for Id Crad Replacment</h1>
        <h3 className=" text-3xl">
          Let fill the form to Apply for ID Card Replacement
        </h3>
      </div>
      <div>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-10 mt-10"
          >
            <div className="flex flex-col md:flex-row gap-16 px-4">
              <div className="flex gap-2 flex-col">
                <div className="flex flex-col md:flex-row gap-4 jc items-center">
                  <FormField
                    control={form.control}
                    name="FirstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>FirstName</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="First Name"
                            {...field}
                            className="dark:text-gray-100 border border-gray-500 rounded-none px-8 py-1 w-96 md:w-44"
                          />
                        </FormControl>
                        <FormDescription>
                          This is your public display name.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="LastName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>LastName</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="First Name"
                            {...field}
                            className="dark:text-gray-100 border border-gray-500 rounded-none px-8 py-1  w-96 md:w-44"
                          />
                        </FormControl>
                        <FormDescription>
                          This is your public display name.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="FirstName"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Collage</FormLabel>
                      <FormControl>
                        <select
                          value={selectedMax}
                          onChange={(e: any) => handleMaxChange(e.target.value)}
                          disabled={checked}
                          className="dark:text-gray-100 border border-gray-500 rounded-none px-8 py-1"
                        >
                          <option value="">Select Program</option>
                          {Collages.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                      </FormControl>
                      <FormDescription>
                        This is your public display name.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="FirstName"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Department</FormLabel>
                      <FormControl>
                        <select
                          value={selectedMax}
                          onChange={(e: any) => handleMaxChange(e.target.value)}
                          disabled={checked}
                          className="dark:text-gray-100 border border-gray-500 rounded-none px-8 py-1"
                        >
                          <option value="">Select Program</option>
                          {Departments.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                      </FormControl>
                      <FormDescription>
                        This is your public display name.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="FirstName"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Program</FormLabel>
                      <FormControl>
                        <select
                          value={selectedMax}
                          onChange={(e: any) => handleMaxChange(e.target.value)}
                          disabled={checked}
                          className="dark:text-gray-100 border border-gray-500 rounded-none px-8 py-1"
                        >
                          <option value="">Select Program</option>
                          {Programs.map((option) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                      </FormControl>
                      <FormDescription>
                        This is your public display name.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="Email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Email"
                          {...field}
                          className="dark:text-gray-100 border border-gray-500 rounded-none px-8 py-1"
                        />
                      </FormControl>
                      <FormDescription>
                        This is your public display name.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="flex flex-col md:flex-row gap-16 px-4">
                <div className="flex gap-2 flex-col">
                  <FormField
                    control={form.control}
                    name="Phone"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Phone</FormLabel>
                        <FormControl>
                          <PhoneInput
                            defaultCountry="ET"
                            placeholder="Enter a phone number"
                            international
                            withCountryCallingCode
                            value={field.value as E164Number | undefined}
                            onChange={field.onChange}
                            className="dark:text-gray-100 border border-gray-500 rounded-none px-8 py-1 w-96"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="FirstName"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Issue Date</FormLabel>
                        <FormControl className="dark:text-gray-100 border border-gray-500 rounded-none px-8 py-1">
                          <DatePicker />
                        </FormControl>
                        <FormDescription>
                          This is your public display name.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="FirstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Id Number</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="R/4583/16"
                            {...field}
                            className="dark:text-gray-100 border border-gray-500 rounded-none px-8 py-1"
                          />
                        </FormControl>
                        <FormDescription>
                          This is your public display name.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="FirstName"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Reasone</FormLabel>
                        <FormControl>
                          <select
                            value={selectedMax}
                            onChange={(e: any) =>
                              handleMaxChange(e.target.value)
                            }
                            disabled={checked}
                            className="dark:text-gray-100 border border-gray-500 rounded-none px-8 py-1"
                          >
                            <option value="">Select Program</option>
                            {Reasons.map((option) => (
                              <option key={option.value} value={option.value}>
                                {option.label}
                              </option>
                            ))}
                          </select>
                        </FormControl>
                        <FormDescription>
                          This is your public display name.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="FirstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea className="dark:text-gray-100 border border-gray-500 rounded-none px-8 py-1 w-80" />
                        </FormControl>
                        <FormDescription>
                          This is your public display name.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              <div className="flex flex-col gap-4 ">
                <h1 className="text-xl font-semibold">Student Photo</h1>
                <div className="flex flex-row gap-6 border-blue-300 border-2 p-2">
                  {/* <div className="p-20 bg-blue-200">Photo</div> */}
                  <Fileuploadform />
                  {/* <div className="flex flex-col gap-24 py-4">
                    <p className="">
                      Upload your Photo of 4x4 Size
                      <br /> This photo is for your Id card
                      <br />{" "}
                    </p>
                    <Button>Upload</Button>
                  </div> */}
                </div>
                <div className="flex justify-center items-center">
                  <Button className={cn("w-full py-6")}>
                    Apply for Finacial Aid
                  </Button>
                </div>
              </div>
            </div>
            <div className="flex mb-6">
              <Button type="submit" className={cn("py-3 mb-4 ")}>
                Submit
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
export default MailCardForm;