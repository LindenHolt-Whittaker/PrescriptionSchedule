import { useForm, Controller, type FieldError } from "react-hook-form";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import Page from "../components/Page";
import "./OnboardingForm.scss";

// Days vars - get type and default values from days array
const days = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
] as const;

type DayName = (typeof days)[number];
type AvailableDays = Record<DayName, boolean>;

const getDefaultDays = (): AvailableDays => {
  return days.reduce(
    (acc, day) => ({ ...acc, [day]: false }),
    {} as AvailableDays
  );
};

interface OnboardingFormData {
  initialDate: Date;
  availableDays: AvailableDays;
  prescriptionType: string;
  dosage: number;
}

const OnboardingForm = () => {
  const {
    register,
    handleSubmit,
    control,
    trigger,
    formState: { errors, isSubmitted },
  } = useForm<OnboardingFormData>({
    defaultValues: {
      initialDate: new Date(),
      availableDays: getDefaultDays(),
      prescriptionType: "",
      dosage: 1,
    },
  });

  const onSubmit = (data: OnboardingFormData) => {
    console.log("Form submitted:", data);
  };

  return (
    <Page title="Onboarding" className="OnboardingForm">
      <form onSubmit={handleSubmit(onSubmit)}>
        <label htmlFor="initialDate">Initial Date</label>
        <Controller
          control={control}
          name="initialDate"
          render={({ field }) => (
            <DatePicker
              selected={field.value}
              onChange={field.onChange}
              dateFormat="MMMM d, yyyy"
              minDate={new Date()}
            />
          )}
        />

        <fieldset className="OnboardingForm__checkboxGroup">
          <legend>Days Available for Pickup</legend>
          {days.map((day) => (
            <label key={day} className="checkbox-day">
              <input
                type="checkbox"
                {...register(`availableDays.${day}`, {
                  validate: (_, formValues) => {
                    const count = Object.values(
                      formValues.availableDays
                    ).filter(Boolean).length;
                    return (
                      (count >= 2 && count <= 7) ||
                      "Please select between 2 and 7 days"
                    );
                  },
                  onChange: () => {
                    if(isSubmitted) {
                      days.forEach((d) => trigger(`availableDays.${d}`));
                    }
                  },
                })}
              />
              <span>{day.charAt(0).toUpperCase() + day.slice(1)}</span>
            </label>
          ))}

          {Object.values(errors.availableDays || {}).some((error) => error) && (
            <span className="error">
              {
                (
                  Object.values(errors.availableDays || {}).find(
                    (error) => error
                  ) as FieldError
                )?.message
              }
            </span>
          )}
        </fieldset>

        <label htmlFor="prescriptionType">Type of Prescription</label>
        <select
          id="prescriptionType"
          {...register("prescriptionType", {
            required: "Please select a prescription type",
          })}
        >
          <option value="">Select prescription type</option>
          <option value="reducing">Reducing</option>
          <option value="increasing">Increasing</option>
          <option value="stabilising">Stabilising</option>
        </select>
        {errors.prescriptionType && (
          <span className="error">{errors.prescriptionType.message}</span>
        )}

        <label htmlFor="dosage">Dosage (mg)</label>
        <input
          type="number"
          id="dosage"
          {...register("dosage", {
            min: { value: 1, message: "Dosage must be at least 1mg" },
            max: { value: 60, message: "Dosage cannot exceed 60mg" },
          })}
        />
        {errors.dosage && (
          <span className="error">{errors.dosage.message}</span>
        )}

        <button type="submit">Submit Onboarding</button>
      </form>
    </Page>
  );
};

export default OnboardingForm;
