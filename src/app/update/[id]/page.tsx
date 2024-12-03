
import React from 'react'
import UpdateTodo from '@/components/tasks/update'

type Props = {
    params: { id: string }
}

const Page: React.FC<Props> = ({ params }) => {
    return (
        <div>
            <UpdateTodo id={params.id} />
        </div>
    )
}

export default Page
