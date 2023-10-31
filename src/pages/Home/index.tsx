import { HandPalm, Play } from "phosphor-react";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from '@hookform/resolvers/zod';
import * as zod from 'zod';
import { useContext } from "react";

import {
  HomeContainer,
  StartButton,
  StopButton,
} from "./styles";
import { NewCycleForm } from "./NewCycleForm";
import { Countdown } from "./Countdown";
import { CyclesContext } from "../../contexts/CyclesContext";

const newCycleFormValidationSchema = zod.object({
  task: zod.string().min(1, 'Informe a tarefa'),
  minutesAmount: zod.number().min(5).max(60),
});

type NewCycleFormData = zod.infer<typeof newCycleFormValidationSchema>;

export function Home() {
  const { activeCycle, createNewCycle, interruptCurrentCycle } = useContext(CyclesContext)

  const newCycleForm = useForm<NewCycleFormData>({
    resolver: zodResolver(newCycleFormValidationSchema),
    defaultValues: {
      task: '',
      minutesAmount: 0,
    },
  });

const { handleSubmit, watch, /* reset */ } = newCycleForm;

  const task = watch('task');
  const isSubmitDisabled = !task;

  return (
    <HomeContainer>
      <form onSubmit={handleSubmit(createNewCycle)} action="">
        <FormProvider {...newCycleForm}>
          <NewCycleForm />
        </FormProvider>
        <Countdown/>

        { activeCycle ? (
          <StopButton type="button" onClick={interruptCurrentCycle}>
            <HandPalm size={24} />
            Parar
          </StopButton>
        ) : (
          <StartButton disabled = {isSubmitDisabled} type="submit">
          <Play size={24} />
          Começar
        </StartButton>
        )}
      </form>
    </HomeContainer>
  )
}
