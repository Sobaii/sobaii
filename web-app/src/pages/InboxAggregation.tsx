import { useNavigate } from "react-router-dom";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { formSchema } from "../schemas/inboxAggregationSchema";
import { aggregateInbox } from "../api/expenseApi";
import { useSpreadsheets } from "../hooks/useSpreadsheets";
import { convertToReadableDate } from "../util/dateUtils";
import AppPage from "../layouts/AppPage";
import SkeletonCard from "../components/ui/SkeletonCard";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";
import { Calendar } from "@/components/ui/Calendar";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { CheckboxIcon } from "@/assets/icons";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/Popover";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/Form";
import { IAggregateInboxFormData } from "@/types/api";

const InboxAggregator = () => {
  const { spreadsheets, isLoading } = useSpreadsheets();
  const navigate = useNavigate();

  const defaultFormState = {
    emailCredentials: [{ emailAddress: "", appPassword: "" }],
    searchCriteria: {
      dateRange: { start: "", end: "" },
      filters: { subject: "", body: "", senderAddress: "" },
    },
    targetSpreadsheetId: "",
  };

  const form = useForm({
    defaultValues: defaultFormState,
    resolver: zodResolver(formSchema),
    mode: "onBlur",
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "emailCredentials",
  });

  const onSubmit = async (formData: IAggregateInboxFormData) => {
    try {
      await aggregateInbox(formData);
    } catch (err) {
      console.error(err);
    }
  };

  const selectedSpreadsheetId = form.watch("targetSpreadsheetId");

  const handleSpreadsheetSelection = (spreadsheetId: string) => {
    if (selectedSpreadsheetId === spreadsheetId) {
      form.setValue("targetSpreadsheetId", "");
    } else {
      form.setValue("targetSpreadsheetId", spreadsheetId);
      form.clearErrors("targetSpreadsheetId");
    }
    form.trigger("targetSpreadsheetId");
  };

  return (
    <AppPage title="Inbox Aggregation">
      <Card>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-6"
          >
            {/* Target Spreadsheet Selection */}
            <div className="flex flex-col gap-4">
              <h4 className="text-2xl font-semibold">1. Target Spreadsheet</h4>
              {isLoading ? (
                <div className="flex gap-4">
                  <SkeletonCard className="h-60" />
                  <SkeletonCard className="h-60" />
                </div>
              ) : spreadsheets.length === 0 ? (
                <div className="flex flex-col gap-4">
                  <p className="text-gray-600">No spreadsheets available.</p>
                  <Button
                    type="button"
                    onClick={() => navigate("/app/dashboard")}
                  >
                    Create New Spreadsheet
                  </Button>
                </div>
              ) : (
                <div className="grid gap-4 md:grid-cols-2 relative">
                  {spreadsheets.map((spreadsheet) => (
                    <div
                      key={spreadsheet.id}
                      className={`p-0 border-2 relative rounded-lg cursor-pointer transition-colors hover:border-gray-400 ${
                        selectedSpreadsheetId === spreadsheet.id
                          ? "!border-blue-500"
                          : "border-gray-200"
                      }`}
                      onClick={() => handleSpreadsheetSelection(spreadsheet.id)}
                    >
                      {selectedSpreadsheetId === spreadsheet.id && (
                        <img
                          src={CheckboxIcon}
                          className="absolute bg-blue-500 rounded-full translate-x-3 -translate-y-3 p-1 w-6 h-6 top-0 right-0"
                        />
                      )}
                      <div className="p-4 space-y-2">
                        <div className="flex justify-between items-center">
                          <h4 className="font-medium truncate">
                            {spreadsheet.name}
                          </h4>
                        </div>
                        <p className="text-sm text-gray-500">
                          {spreadsheet.numberOfExpenses} entries
                        </p>
                        <p className="text-sm text-gray-500">
                          Last accessed:{" "}
                          {convertToReadableDate(spreadsheet.lastOpened)}
                        </p>
                      </div>
                      {spreadsheet.imageUrl && (
                        <img
                          src={spreadsheet.imageUrl || "/placeholder.svg"}
                          className="w-full h-32 object-cover"
                          alt={`Preview of ${spreadsheet.name}`}
                        />
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
            <hr />

            {/* Email Accounts */}
            <div className="flex flex-col gap-4">
              <h4 className="text-2xl font-semibold">2. Email Accounts</h4>
              {fields.map((field, index) => (
                <div key={field.id} className="flex gap-3">
                  <FormField
                    control={form.control}
                    name={`emailCredentials.${index}.emailAddress`}
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel>Email Address</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="jane.doe@example.com"
                            type="email"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`emailCredentials.${index}.appPassword`}
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel>Application Password</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            placeholder="Enter application password"
                            type="password"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {fields.length > 1 && (
                    <div>
                     <h2 className="opacity-0">/</h2>
                      <Button
                        type="button"
                        onClick={() => {
                          remove(index);
                        }}
                        variant="destructive"
                      >
                        Remove Account
                      </Button>
                    </div>
                  )}
                </div>
              ))}
              <Button
                type="button"
                onClick={() => append({ emailAddress: "", appPassword: "" })}
              >
                Add Email Account
              </Button>
            </div>
            <hr />

            {/* Search Parameters */}
            <div className="flex flex-col gap-4">
              <h4 className="text-2xl font-semibold">3. Search Parameters</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <FormField
                  control={form.control}
                  name="searchCriteria.dateRange.start"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Start Date</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button variant="outline">
                              {field.value ? (
                                format(new Date(field.value), "PPP")
                              ) : (
                                <span>Pick a start date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={
                              field.value ? new Date(field.value) : undefined
                            }
                            onSelect={(date) =>
                              date && field.onChange(date.toISOString())
                            }
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="searchCriteria.dateRange.end"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>End Date</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button variant="outline">
                              {field.value ? (
                                format(new Date(field.value), "PPP")
                              ) : (
                                <span>Pick an end date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={
                              field.value ? new Date(field.value) : undefined
                            }
                            onSelect={(date) =>
                              date && field.onChange(date.toISOString())
                            }
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                <FormField
                  control={form.control}
                  name="searchCriteria.filters.subject"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Subject Contains</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="e.g. Invoice Update" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="searchCriteria.filters.body"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Body Contains</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="e.g. Payment details" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="searchCriteria.filters.senderAddress"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Sender Email</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="e.g. sender@example.com"
                          type="email"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <hr />
            {/* Submit Button */}
            <Button type="submit" disabled={!form.formState.isValid}>
              Process Inboxes
            </Button>
          </form>
        </Form>
      </Card>
    </AppPage>
  );
};

export default InboxAggregator;
