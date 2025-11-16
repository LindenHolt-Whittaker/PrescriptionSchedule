import { useForm, Controller, type FieldError } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import Page from "../../components/Page";
import { DAYS, getDefaultDays, capitalizeDayName } from "../../utils/days";
import { type PrescriptionData } from "../../types/prescriptionData";
import "./OnboardingForm.scss";

const OnboardingForm = () => {
  const {
    register,
    handleSubmit,
    control,
    trigger,
    watch,
    formState: { errors, isSubmitted },
  } = useForm<PrescriptionData>({
    defaultValues: {
      initialDate: new Date(),
      availableDays: getDefaultDays(),
      prescriptionType: "",
      dosage: 0,
      changeAmount: undefined,
      changeFrequency: undefined,
    },
  });

  const navigate = useNavigate();

  const onSubmit = (data: PrescriptionData) => {
    const params = new URLSearchParams({
      data: JSON.stringify(data),
    });

    navigate(`/schedule?${params.toString()}`);
  };

  const prescriptionType = watch("prescriptionType");
  const isDosageChanging =
    prescriptionType === "increasing" || prescriptionType === "reducing";

  return (
    <Page title="Onboarding" className="OnboardingForm">
      <form onSubmit={handleSubmit(onSubmit)}>
        <label htmlFor="initialDate">When is this prescription to be scheduled for?</label>
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
          <legend>What days will you be available to get your prescription?</legend>
          {DAYS.map((day) => (
            <label key={day} className="checkbox-day">
              <input
                type="checkbox"
                {...register(`availableDays.${day}`, {
                  validate: (_, formValues) => {
                    const count = Object.values(
                      formValues.availableDays
                    ).filter(Boolean).length;
                    return count >= 2 || "Please select more than 2 days";
                  },
                  onChange: () => {
                    if (isSubmitted) {
                      DAYS.forEach((d) => trigger(`availableDays.${d}`));
                    }
                  },
                })}
              />
              <span>{capitalizeDayName(day)}</span>
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

        <label htmlFor="prescriptionType">What type of prescription is this?</label>
        <select
          id="prescriptionType"
          {...register("prescriptionType", {
            required: "Please select a prescription type",
          })}
        >
          <option value="">Select prescription type</option>
          <option value="stabilisation">Stabilisation</option>
          <option value="reducing">Reducing</option>
          <option value="increasing">Increasing</option>
        </select>
        {errors.prescriptionType && (
          <span className="error">{errors.prescriptionType.message}</span>
        )}

        <label htmlFor="dosage">
          {isDosageChanging ? "How much is the initial dosage? (mg)" : "How much is the dosage? (mg)"}
        </label>
        <input
          type="number"
          id="dosage"
          {...register("dosage", {
            min: { value: 0, message: "Dosage must be at least 0mg" },
            max: { value: 60, message: "Dosage cannot exceed 60mg" },
            required: "Please provide dosage amount",
          })}
        />
        {errors.dosage && (
          <span className="error">{errors.dosage.message}</span>
        )}

        {isDosageChanging && (
          <>
            <label htmlFor="changeAmount">
              How much is the dosage {prescriptionType === "increasing" ? 'increasing' : 'reducing'} by? (mg)
            </label>
            <input
              type="number"
              id="changeAmount"
              {...register("changeAmount", {
                required: isDosageChanging
                  ? "Change amount is required"
                  : false,
                min: {
                  value: 1,
                  message: "Change amount must be at least 1mg",
                },
                max: { value: 30, message: "Change amount cannot exceed 30mg" },
              })}
            />
            {errors.changeAmount && (
              <span className="error">{errors.changeAmount.message}</span>
            )}

            <label htmlFor="changeFrequency">How frequently (in days) does this dosage {prescriptionType === "increasing" ? 'increase' : 'reduce'}?</label>
            <input
              type="number"
              id="changeFrequency"
              {...register("changeFrequency", {
                required: isDosageChanging ? "Frequency is required" : false,
                min: { value: 1, message: "Frequency must be at least 1 day" },
                max: { value: 14, message: "Frequency cannot exceed 14 days" },
              })}
            />
            {errors.changeFrequency && (
              <span className="error">{errors.changeFrequency.message}</span>
            )}
          </>
        )}

        <button type="submit">Submit Onboarding</button>
      </form>
    </Page>
  );
};

export default OnboardingForm;
