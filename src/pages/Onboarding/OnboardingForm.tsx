import {
  useForm,
  Controller,
  type FieldError as FieldErrorType,
} from "react-hook-form";
import { useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import Page from "../../components/Page";
import FieldError from "../../components/FieldError";
import Button from "../../components/Button";
import { DAYS, getDefaultDays, capitalizeDayName } from "../../utils/days";
import { encodePrescriptionData } from "../../utils/scheduleKey";
import {
  VALIDATION_RULES,
  isValidDosageTotal,
} from "../../validators/prescription";
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
    try {
      const key = encodePrescriptionData(data);
      navigate(`/schedule?k=${key}`);
    } catch (error) {
      console.error("Failed to encode prescription data:", error);
    }
  };

  const prescriptionType = watch("prescriptionType");
  const isDosageChanging =
    prescriptionType === "increasing" || prescriptionType === "reducing";

  return (
    <Page
      title="Please provide your prescription information"
      className="OnboardingForm"
    >
      <form className="OnboardingForm__form" onSubmit={handleSubmit(onSubmit)}>
        <label htmlFor="initialDate">
          When is this prescription to be scheduled for?
        </label>
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
        {/* This FieldError never showing error, due to initial date provided, this here just for spacing */}
        <FieldError />

        <fieldset className="OnboardingForm__form__checkboxGroup">
          <legend>
            What days will you be available to get your prescription?
          </legend>
          {DAYS.map((day) => (
            <label key={day} className="checkbox-day">
              <input
                type="checkbox"
                {...register(`availableDays.${day}`, {
                  validate: (_, formValues) => {
                    const count = Object.values(
                      formValues.availableDays
                    ).filter(Boolean).length;
                    return (
                      count >= VALIDATION_RULES.availableDays.min ||
                      `Please select at least ${
                        VALIDATION_RULES.availableDays.min
                      } day${VALIDATION_RULES.availableDays.min > 1 ? "s" : ""}`
                    );
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

          <FieldError>
            {
              (
                Object.values(errors.availableDays || {}).find(
                  (error) => error
                ) as FieldErrorType | undefined
              )?.message
            }
          </FieldError>
        </fieldset>

        <label htmlFor="prescriptionType">
          What type of prescription is this?
        </label>
        <select
          id="prescriptionType"
          {...register("prescriptionType", {
            required: "Please select a prescription type",
            onChange: () => {
              if (isSubmitted) {
                trigger("dosage");
              }
            },
          })}
        >
          <option value="">Select prescription type</option>
          <option value="stabilisation">Stabilisation</option>
          <option value="reducing">Reducing</option>
          <option value="increasing">Increasing</option>
        </select>
        <FieldError>
          {errors.prescriptionType && errors.prescriptionType.message}
        </FieldError>

        <label htmlFor="dosage">
          What is the {isDosageChanging ? "initial dosage" : "dosage"}? (mg)
        </label>
        <input
          type="number"
          id="dosage"
          {...register("dosage", {
            min: {
              value: VALIDATION_RULES.dosage.min,
              message: `Dosage must be at least ${VALIDATION_RULES.dosage.min}mg`,
            },
            max: {
              value: VALIDATION_RULES.dosage.max,
              message: `Dosage cannot exceed ${VALIDATION_RULES.dosage.max}mg`,
            },
            required: "Please provide dosage amount",
            validate: {
              validTotal: (value, formValues) => {
                return (
                  isValidDosageTotal(
                    formValues.prescriptionType,
                    Number(value)
                  ) || "This prescription will result in 0mg total dosage"
                );
              },
            },
          })}
        />
        <FieldError>{errors.dosage && errors.dosage.message}</FieldError>

        {isDosageChanging && (
          <>
            <label htmlFor="changeAmount">
              How much is the dosage{" "}
              {prescriptionType === "increasing" ? "increasing" : "reducing"}{" "}
              by? (mg)
            </label>
            <input
              type="number"
              id="changeAmount"
              {...register("changeAmount", {
                required: isDosageChanging
                  ? "Change amount is required"
                  : false,
                min: {
                  value: VALIDATION_RULES.changeAmount.min,
                  message: `Change amount must be at least ${VALIDATION_RULES.changeAmount.min}mg`,
                },
                max: {
                  value: VALIDATION_RULES.changeAmount.max,
                  message: `Change amount cannot exceed ${VALIDATION_RULES.changeAmount.max}mg`,
                },
              })}
            />
            <FieldError>
              {errors.changeAmount && errors.changeAmount.message}
            </FieldError>

            <label htmlFor="changeFrequency">
              How frequently is the prescription{" "}
              {prescriptionType === "increasing" ? "increasing" : "decreasing"}?
              (days)
            </label>
            <input
              type="number"
              id="changeFrequency"
              {...register("changeFrequency", {
                required: isDosageChanging ? "Frequency is required" : false,
                min: {
                  value: VALIDATION_RULES.changeFrequency.min,
                  message: `Frequency must be at least ${
                    VALIDATION_RULES.changeFrequency.min
                  } day${VALIDATION_RULES.changeFrequency.min > 1 ? "s" : ""}`,
                },
                max: {
                  value: VALIDATION_RULES.changeFrequency.max,
                  message: `Frequency cannot exceed ${VALIDATION_RULES.changeFrequency.max} days`,
                },
              })}
            />
            <FieldError>
              {errors.changeFrequency && errors.changeFrequency.message}
            </FieldError>
          </>
        )}

        <Button type="submit">Submit Onboarding</Button>
      </form>
    </Page>
  );
};

export default OnboardingForm;
