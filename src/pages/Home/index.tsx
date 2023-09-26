import { HandPalm, Play } from "phosphor-react";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { zodResolver } from '@hookform/resolvers/zod';
import * as zod from 'zod';
import { differenceInSeconds, set } from 'date-fns';

import {
  CountdownContainer,
  FormContainer,
  HomeContainer,
  MinutesAmountInput,
  Separator,
  StartButton,
  StopButton,
  TaskInput,
} from "./styles";

const newCycleFormValidationSchema = zod.object({
  task: zod.string().min(1, 'Informe a tarefa'),
  minutesAmount: zod.number().min(5).max(60),
});

type NewCycleFormData = zod.infer<typeof newCycleFormValidationSchema>;

interface Cycle {
  id: string;
  task: string;
  minutesAmount: number;
  startDate: Date;
  interruptedDate?: Date;
  finishedDate?: Date;
}

export function Home() {
  const [cycles, setCycles] = useState<Cycle[]>([]);
  const [activeCycleId, setActiveCycleId] = useState<string | null>(null);
  const [amountSecondsPassed, setAmountSecondsPassed] = useState(0);

  const { register, handleSubmit, watch, reset } = useForm<NewCycleFormData>({
  });

  const activeCycle = cycles.find((cycle) => cycle.id === activeCycleId)

  const totalSeconds = activeCycle? activeCycle.minutesAmount * 60 : 0

  useEffect(() => {

    let interval: NodeJS.Timeout;

    if (activeCycle) {
      interval = setInterval(() => {
        const secondDifference = differenceInSeconds (
          new Date(),
          activeCycle.startDate,
        )
        
        if (secondDifference >= totalSeconds) {
          setCycles((state) => 
            state.map((cycle) => {
              if (cycle.id === activeCycleId) {
                return { ...cycle, finishedDate: new Date() }
              } else {
                return cycle
              }
            })
          )

            setAmountSecondsPassed(totalSeconds);
            clearInterval(interval);
        } else {
          setAmountSecondsPassed(secondDifference);
        }
      }, 1000)
    }

    return () => {
      clearInterval(interval);
    }

  }, [activeCycle, totalSeconds, activeCycleId, cycles])

  function handleCreateNewCycle(data: NewCycleFormData) {
    setCycles((state) =>
      state.map((cycle) => {
        if (cycle.id === activeCycleId) {
          return { ...cycle, interruptedDate: new Date() }
        } else {
          return cycle
        }
      }),
    );
    setActiveCycleId(null);
  }

  const currentSeconds = activeCycle? totalSeconds - amountSecondsPassed : 0

  const minutesAmount = Math.floor(currentSeconds / 60);
  const secondsAmount = currentSeconds % 60;

  const minutes = String(minutesAmount).padStart(2, '0');
  const seconds = String(secondsAmount).padStart(2, '0');

  useEffect(() => {
    if (activeCycle) {
    document.title = `${minutes}:${seconds} | Zapa_Timer`
    }
  }, [activeCycle, minutes, seconds])

  const task = watch('task');
  const isSubmitDisabled = !task;

  return (
    <HomeContainer>
      <form onSubmit={handleSubmit(handleCreateNewCycle)} action="">
        <FormContainer>
          <label htmlFor="">Vou Trabalhar em</label>
          <TaskInput
            id="task"
            list="task-suggestions"
            placeholder="Dê um nome para o seu projeto"
            disabled={!!activeCycleId}
            {...register('task')}
          />

          <datalist id="task-suggestions">
            <option value="Projeto 1" />
            <option value="Projeto 2" />
            <option value="Projeto 3" />
            <option value="Floquinho" />
          </datalist>

          <label htmlFor="minutosAmount">durante</label>
          <MinutesAmountInput
          type="number"
          id="minutesAmount"
          placeholder="00"
          step={5}
          min={5}
          max={60}
          disabled={!!activeCycleId}
          {...register('minutesAmount', { valueAsNumber: true })}
          />

          <span>minutos.</span>
        </FormContainer>

        <CountdownContainer>
          <span>{minutes[0]}</span>
          <span>{minutes[1]}</span>
          <Separator>:</Separator>
          <span>{seconds[0]}</span>
          <span>{seconds[1]}</span>
        </CountdownContainer>

        { activeCycleId ? (
          <StopButton type="button">
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
