"use client";
import { useRouter } from 'next/navigation';
import React, { useEffect, useRef } from 'react'
import toast, { Toaster } from 'react-hot-toast';

const editBlog = async (title: string| undefined, description: string| undefined, id: number) => {
    const res = await fetch(`http://localhost:3000/api/blog/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({title, description, id}),
    });
}

const deleteBlog = async (id: number) => {
    const res = await fetch(`http://localhost:3000/api/blog/${id}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
        },
    });
}
const getBlogByID = async (id: number) => {
    const res = await fetch(`http://localhost:3000/api/blog/${id}`);
    const data = await res.json();
    return data.post;
}


const EditPost = ({params}: {params: {id: number}}) => {
    const router = useRouter();
    const titleref = useRef<HTMLInputElement | null>(null);
    const descriptionref = useRef<HTMLTextAreaElement | null>(null);

    useEffect(() => {
        getBlogByID(params.id)
            .then((data) => {
                if(titleref.current && descriptionref.current){
                    titleref.current.value = data.title;
                    descriptionref.current.value = data.description;
                }
            })
            .catch((err) => {
                toast.error("エラーが発生しました");
            })
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        toast.loading("編集中です・・・");
        await editBlog(titleref.current?.value, descriptionref.current?.value, params.id);

        router.push('/');
        router.refresh();
        //toast.loading("投稿中です・・・");
        toast.success("編集に成功しました！");
    }

    const handleDelete = async (e: React.FormEvent) => {
        e.preventDefault();
        toast.loading("削除しています");
        await deleteBlog(params.id);

        toast.success("削除しました！");
        router.push('/');
        router.refresh();
    }
  return (
    <>
    <Toaster />
  <div className="w-full m-auto flex my-4">
    <div className="flex flex-col justify-center items-center m-auto">
      <p className="text-2xl text-slate-200 font-bold p-3">ブログの編集 🚀</p>
      <form onSubmit={handleSubmit}>
        <input
        ref = {titleref}
          placeholder="タイトルを入力"
          type="text"
          className="rounded-md px-4 w-full py-2 my-2"
        />
        <textarea
        ref = {descriptionref}
          placeholder="記事詳細を入力"
          className="rounded-md px-4 py-2 w-full my-2"
        ></textarea>
        <button className="font-semibold px-4 py-2 shadow-xl bg-slate-200 rounded-lg m-auto hover:bg-slate-100">
          更新
        </button>
        <button onClick={handleDelete}
         className="ml-2 font-semibold px-4 py-2 shadow-xl bg-red-400 rounded-lg m-auto hover:bg-slate-100">
          削除
        </button>
      </form>
    </div>
  </div>
</>
  )
}

export default EditPost