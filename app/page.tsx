'use client'

import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

type Customer = {
  id: number
  customer_id: string
  customer_name: string
}

export default function Home() {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [customerName, setCustomerName] = useState('')
  const [searchText, setSearchText] = useState('')


  const [selectedCustomer, setSelectedCustomer] =
    useState<Customer | null>(null)

  const [bottleSearch, setBottleSearch] = useState('')

  const [bottleName, setBottleName] = useState('')
  const [hostess, setHostess] = useState('')
  const [brand, setBrand] = useState('')
  const [lastVisit, setLastVisit] = useState('')
  const [stockType, setStockType] = useState('gram')
  const [stockValue, setStockValue] = useState('')

  const [bottles, setBottles] = useState<any[]>([])
  const [editBottleId, setEditBottleId] =
  useState<number | null>(null)

const [editStockValue, setEditStockValue] =
  useState('')
const [editStockType, setEditStockType] =
  useState('gram')

  console.log('selectedCustomer', selectedCustomer)

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

  async function addCustomer() {
    if (!customerName) return

    const nextNumber = customers.length + 1

    const customerId =
      'C' + String(nextNumber).padStart(4, '0')

    const { error } = await supabase
      .from('customers')
      .insert({
        customer_id: customerId,
        customer_name: customerName,
      })

    if (error) {
      alert(error.message)
      return
    }

    setCustomerName('')
    loadCustomers()
  }

  async function addBottle() {
    if (!selectedCustomer) {
      alert('顧客を選択してください')
      return
    }
  
    const { data, error } = await supabase
      .from('bottles')
      .insert({
        customer_id: selectedCustomer.customer_id,
        bottle_name: bottleName,
        hostess,
        brand,
        last_visit: lastVisit,
        stock_type: stockType,
        stock_value: stockValue,
      })
      .select()
  
    if (error) {
      alert(error.message)
      return
    }
  
    alert('ボトル登録完了')
    loadBottles(selectedCustomer.customer_id)

    setBottleName('')
    setHostess('')
    setBrand('')
    setLastVisit('')
    setStockValue('')
    }
  
  async function loadBottles(customerId: string) {
    const { data } = await supabase
      .from('bottles')
      .select('*')
      .eq('customer_id', customerId)
  
    setBottles(data || [])
  }
  async function updateBottle() {
    if (!editBottleId || !selectedCustomer) return
  
    const { error } = await supabase
      .from('bottles')
      .update({
        stock_value: editStockValue,
        stock_type: editStockType,
      })
      .eq('id', editBottleId)
  
    if (error) {
      alert(error.message)
      return
    }
  
    setEditBottleId(null)
    setEditStockValue('')
  
    loadBottles(selectedCustomer.customer_id)
  }
  
  async function deleteBottle(id: number) {
    if (!selectedCustomer) return
  
    const result = confirm('削除しますか？')
  
    if (!result) return
  
    const { error } = await supabase
      .from('bottles')
      .delete()
      .eq('id', id)
  
    if (error) {
      alert(error.message)
      return
    }
  
    loadBottles(selectedCustomer.customer_id)
  }
  return (
    <main className="p-3 md:p-5 max-w-4xl mx-auto">

      <h1 className="text-3xl font-bold mb-5">
        キープボトル管理
      </h1>

      <div className="border rounded p-4 mb-6">

        <h2 className="font-bold mb-3">
          顧客追加
        </h2>
      

        <input
          value={customerName}
          onChange={(e) =>
            setCustomerName(e.target.value)
          }
          placeholder="顧客名"
          className="border rounded p-2 w-full mb-3"
        />

        <button
          onClick={addCustomer}
          className="bg-blue-600 text-white w-full py-3 rounded-lg"        >
          登録
        </button>

      </div>

      <h2 className="font-bold text-xl mb-3">
        顧客一覧
      </h2>

      <input
  value={searchText}
  onChange={(e) => setSearchText(e.target.value)}
  placeholder="顧客検索"
  className="border rounded p-2 w-full mb-3"
/>

      <p className="text-red-500 mb-3">
        選択中：
        {selectedCustomer?.customer_name || 'なし'}
      </p>

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
          className="border rounded-xl p-4 mb-3 shadow-sm"
        >
          <div>{customer.customer_id}</div>

          <div>{customer.customer_name}</div>

          <button
  onClick={() => {
    setSelectedCustomer(customer)
    loadBottles(customer.customer_id)
  }}
  className="bg-gray-600 text-white px-3 py-1 rounded mt-2"
>
  詳細
</button>

        </div>
      ))}

{selectedCustomer && (
  <div
    className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
  >

<h2 className="text-2xl font-bold text-blue-700 mb-4">
  顧客詳細
</h2>
<button
  onClick={() => setSelectedCustomer(null)}
  className="bg-gray-500 text-white px-3 py-1 rounded mb-4"
>
  閉じる
</button>

<button
  onClick={() => setSelectedCustomer(null)}
  className="bg-gray-500 text-white px-3 py-1 rounded mb-3"
>
  閉じる
</button>

    <p>
      顧客ID：
      {selectedCustomer.customer_id}
    </p>

    <p>
      顧客名：
      {selectedCustomer.customer_name}
    </p>
    <h3 className="font-bold mt-4 mb-2">
  ボトル追加
</h3>
<input
  value={bottleSearch}
  onChange={(e) => setBottleSearch(e.target.value)}
  placeholder="ボトル名・銘柄・指名で検索"
  className="border rounded p-2 w-full mb-3"
/>
<input
  value={bottleName}
  onChange={(e) => setBottleName(e.target.value)}
  placeholder="ボトル名"
  className="border p-2 w-full mb-2 rounded"
/>

<input
  value={hostess}
  onChange={(e) => setHostess(e.target.value)}
  placeholder="指名"
  className="border p-2 w-full mb-2 rounded"
/>

<input
  value={brand}
  onChange={(e) => setBrand(e.target.value)}
  placeholder="銘柄"
  className="border p-2 w-full mb-2 rounded"
/>

<input
  type="date"
  value={lastVisit}
  onChange={(e) => setLastVisit(e.target.value)}
  className="border p-2 w-full mb-2 rounded"
/>

<select
  value={stockType}
  onChange={(e) => setStockType(e.target.value)}
  className="border p-2 w-full mb-2 rounded"
>
  <option value="gram">
    残量(g)
  </option>

  <option value="shelf">
    棚保管
  </option>
</select>

<input
  value={stockValue}
  onChange={(e) => setStockValue(e.target.value)}
  placeholder="残量"
  className="border p-2 w-full mb-2 rounded"
/>

<button
  onClick={addBottle}
  className="bg-green-600 text-white px-4 py-2 rounded mb-4"
>
  ボトル登録
</button>
    <h3 className="text-lg font-bold text-gray-700 mt-4 mb-3">
  登録ボトル
</h3>
<input
  value={bottleSearch}
  onChange={(e) => setBottleSearch(e.target.value)}
  placeholder="ボトル名・銘柄・指名で検索"
  className="border rounded-lg p-3 w-full mb-3"
/>

    {bottles.length === 0 && (
      <p>登録ボトルなし</p>
    )}

{bottles
  .filter((bottle) =>
    bottle.bottle_name
      ?.toLowerCase()
      .includes(bottleSearch.toLowerCase()) ||

    bottle.brand
      ?.toLowerCase()
      .includes(bottleSearch.toLowerCase()) ||

    bottle.hostess
      ?.toLowerCase()
      .includes(bottleSearch.toLowerCase())
  )
  .map((bottle) => (
  <div
    key={bottle.id}
    className="bg-white border border-gray-200 p-4 mb-3 rounded-xl shadow-sm"
  >
    <div>
      ボトル名：
      {bottle.bottle_name}
    </div>

    <div>
      銘柄：
      {bottle.brand}
    </div>

    <div>
  指名：
  {bottle.hostess || '未登録'}
</div>

    <div>
      状態：
      {bottle.stock_type === 'gram'
        ? `${bottle.stock_value}g`
        : '棚保管'}
    </div>

    <div>
  最終来店：
  {bottle.last_visit || '未登録'}
</div>

    <div className="flex gap-2 mt-3">

    <button
  onClick={() => {
    setEditBottleId(bottle.id)

    setEditStockValue(
      bottle.stock_value || ''
    )

    setEditStockType(
      bottle.stock_type || 'gram'
    )
  }}
  className="bg-blue-600 text-white px-4 py-3 rounded-lg"
>
  編集
</button>
      <button
        onClick={() => deleteBottle(bottle.id)}
        className="bg-red-600 text-white px-4 py-3 rounded-lg"
      >
        削除
      </button>

    </div>

  </div>
))}
{editBottleId && (
  <div className="border p-4 rounded bg-blue-50 mt-3">

    <h4 className="font-bold mb-2">
      残量編集
    </h4>
    <select
  value={editStockType}
  onChange={(e) =>
    setEditStockType(e.target.value)
  }
  className="border p-2 mb-2 mr-2"
>
  <option value="gram">
    残量(g)
  </option>

  <option value="shelf">
    棚保管
  </option>
</select>
    <input
      value={editStockValue}
      onChange={(e) =>
        setEditStockValue(e.target.value)
      }
      className="border p-2 mr-2"
    />

    <button
      onClick={updateBottle}
      className="bg-green-600 text-white px-3 py-2 rounded"
    >
      保存
    </button>

  </div>
)}
  </div>
)}

</main>
  )
}