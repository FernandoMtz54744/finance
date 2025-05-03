interface props {
    title: string
}

export default function TitleComponent({title}: props) {
  return (
    <div className='text-3xl my-6'>{title}</div>
  )
}
