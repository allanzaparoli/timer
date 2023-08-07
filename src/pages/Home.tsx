import { Play } from "phosphor-react";

export function Home() {
  return (
    <div>
      <form action="">
        <label htmlFor="">Vou Trabalhar em</label>
        <input id="task" />

        <label htmlFor="minutosAmount">durante</label>
        <input type="number" id="minutesAmount" />

        <span>minutos.</span>

        <div>
          <span>0</span>
          <span>0</span>
          <span>:</span>
          <span>0</span>
          <span>0</span>
        </div>

        <button type="submit">
          <Play size={24} />
          Começar
        </button>
      </form>
    </div>
  )
}
