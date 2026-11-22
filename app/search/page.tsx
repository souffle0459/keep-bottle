'use client'

import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import Link from 'next/link'

type Customer = {
  id: number
  customer_id: string
  customer_name: string
  hostess: string | null
}

export default function SearchPage() {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [searchText, setSearchText] = useState('')
  const [selectedCustomer, setSelectedCustomer] =
  useState<Customer | null>(null)
  const [bottles, setBottles] = useState<any[]>([])
  const [showAddBottle, setShowAddBottle] =
  useState(false)

const [bottleName, setBottleName] =
  useState('')

const [brand, setBrand] =
  useState('')

const [lastVisit, setLastVisit] =
  useState('')

const [stockType, setStockType] =
  useState('gram')

const [stockValue, setStockValue] =
  useState('')

  useEffect(() => {
    loadCustomers()
  }, [])

  async function loadCustomers() {
    const { data } = await supabase
      .from('customers')
      .select('*')
      .order('customer_id')

    setCustomers(data || [])
  }
  async function loadBottles(customerId: string) {

    const { data } = await supabase
      .from('bottles')
      .select('*')
      .eq('customer_id', customerId)
  
    setBottles(data || [])
  }
  async function addBottle() {
    if (!selectedCustomer) return
  
    const { error } = await supabase
      .from('bottles')
      .insert({
        customer_id: selectedCustomer.customer_id,
        bottle_name: bottleName,
        brand,
        last_visit: lastVisit,
        stock_type: stockType,
        stock_value: stockValue,
      })
  
    if (error) {
      alert(error.message)
      return
    }
  
    alert('ボトル登録完了')
  
    setBottleName('')
    setBrand('')
    setLastVisit('')
    setStockValue('')
  
    loadBottles(selectedCustomer.customer_id)
  }
  async function addBottle() {
    if (!selectedCustomer) return
  
    const { error } = await supabase
      .from('bottles')
      .insert({
        customer_id: selectedCustomer.customer_id,
        bottle_name: bottleName,
        brand,
        last_visit: lastVisit,
        stock_type: stockType,
        stock_value: stockValue,
      })
  
    if (error) {
      alert(error.message)
      return
    }
  
    alert('ボトル登録完了')
  
    setBottleName('')
    setBrand('')
    setLastVisit('')
    setStockValue('')
  
    loadBottles(selectedCustomer.customer_id)
  }
  return (
    <main className="p-4 max-w-4xl mx-auto">

      <h1 className="text-3xl font-bold mb-5">
        検索・編集
      </h1>

      <input
        value={searchText}
        onChange={(e) =>
          setSearchText(e.target.value)
        }
        placeholder="顧客検索"
        className="border p-3 w-full rounded-lg mb-4"
      />

      {customers
        .filter((customer) =>
          customer.customer_name
            .toLowerCase()
            .includes(searchText.toLowerCase()) ||
          customer.customer_id
            .toLowerCase()
            .includes(searchText.toLowerCase())
        )
        .map((customer) => (
          <div
            key={customer.id}
            className="border rounded-xl p-4 mb-3"
          >
           <div>
  {customer.customer_id}
</div>

<div>
  {customer.customer_name}
</div>

<div className="text-sm text-gray-500">
  担当：
  {customer.hostess || '未登録'}
</div>

<button
  onClick={() => {
    setSelectedCustomer(customer)
    loadBottles(customer.customer_id)
  }}
  className="bg-blue-600 text-white px-4 py-2 rounded mt-2"
>
  詳細
</button>
          </div>
        ))}
{selectedCustomer && (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
    <div className="bg-white text-black w-full max-w-md rounded-xl p-5">

      <h2 className="text-xl font-bold mb-3">
        {selectedCustomer.customer_name}
      </h2>
      <p className="mb-3">
  担当：
  {selectedCustomer.hostess || '未登録'}
</p>

      <p className="mb-3">
        顧客番号：
        {selectedCustomer.customer_id}
      
      </p>

      <button
        onClick={() => setSelectedCustomer(null)}
        className="bg-gray-500 text-white px-3 py-2 rounded"
      >
        閉じる

      </button>
      <button
  onClick={() =>
    setShowAddBottle(true)
  }
  className="bg-green-600 text-white px-4 py-2 rounded mb-3"
>
  ボトル追加
</button>
{showAddBottle && (
  <div className="border p-4 rounded bg-green-50 mb-4">

    <input
      value={bottleName}
      onChange={(e) =>
        setBottleName(e.target.value)
      }
      placeholder="ボトル名"
      className="border p-2 w-full mb-2 text-black"
    />

    <input
      value={brand}
      onChange={(e) =>
        setBrand(e.target.value)
      }
      placeholder="銘柄"
      className="border p-2 w-full mb-2 text-black"
    />

    <button
      onClick={addBottle}
      className="bg-green-600 text-white px-4 py-2 rounded"
    >
      登録
    </button>

  </div>
)}
      <h3 className="font-bold mt-4 mb-2">
  登録ボトル
</h3>

{bottles.length === 0 ? (
  <p>登録ボトルなし</p>
) : (
  bottles.map((bottle) => (
    <div
      key={bottle.id}
      className="border rounded p-2 mb-2"
    >
      <div>
        {bottle.bottle_name}
      </div>

      <div className="text-sm text-gray-500">
        {bottle.brand}
      </div>
    </div>
  ))
)}
    </div>
  </div>
)}
      <Link
        href="/"
        className="block bg-gray-600 text-white text-center p-4 rounded-lg mt-6"
      >
        登録画面へ戻る
      </Link>

    </main>
  )
}