import React from 'react'
import UpdateTodo from '@/components/tasks/update'

type Props = {
    params: {
        id: string
    }
}

function page({ params }: Props) {
    return (
        <div>
            <UpdateTodo id={params.id}/>
        </div>
    )
}

export default page