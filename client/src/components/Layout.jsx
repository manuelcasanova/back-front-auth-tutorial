//Represents all the children of the layout component. Anything nested in the Layout component is represented by the outlet. That allows us to apply more things to our app (header, footer...). We can also have multiple outlets.

import { Outlet } from 'react-router-dom';

export default function Layout () {
  return (
    <main className="App">
      <Outlet />
    </main>
  )
}