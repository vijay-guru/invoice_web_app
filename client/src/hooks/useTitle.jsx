import {useEffect} from 'react'

function useTitle(title) {
    useEffect(()=>{
        const prevTitle = document.title
        document.title = title

        return ()=>(document.title = prevTitle)
    },[title])
  return (
    <div>useTitle</div>
  )
}

export default useTitle