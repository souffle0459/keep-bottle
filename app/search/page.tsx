'use client'

import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import Link from 'next/link'

type Customer = {
  id: number
  customer_id: string
  customer_name: string
}

export default function SearchPage() {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [searchText, setSearchText] = useState('')
  const [selectedCustomer, setSelectedCustomer] =
  useState<Customer | null>(null)

const [bottles, setBottles] = useState<any[]>([])
const [editBottleId, setEditBottleId] =
  useState<number | null>(null)

const [editStockValue, setEditStockValue] =
  useState('')
  const [showNewCustomer, setShowNewCustomer] =
  useState(false)

const [customerName, setCustomerName] =
  useState('')

const [editStockType, setEditStockType] =
  useState('gram')
  const [showAddBottle, setShowAddBottle] =
  useState(false)

const [bottleName, setBottleName] =
  useState('')

const [hostess, setHostess] =
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
  
    loadBottles(selectedCustomer.customer_id)
  }
  async function addBottle() {
    if (!selectedCustomer) return
  
    const { error } = await supabase
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
  
    if (error) {
      alert(error.message)
      return
    }
  
    setShowAddBottle(false)
  
    setBottleName('')
    setHostess('')
    setBrand('')
    setLastVisit('')
    setStockValue('')
  
    loadBottles(selectedCustomer.customer_id)
  }
  async function addCustomerAndBottle() {
    const nextNumber = customers.length + 1
  
    const customerId =
      'C' + String(nextNumber).padStart(4, '0')
  
    const { error: customerError } =
      await supabase
        .from('customers')
        .insert({
          customer_id: customerId,
          customer_name: customerName,
        })
  
    if (customerError) {
      alert(customerError.message)
      return
    }
  
    const { error: bottleError } =
      await supabase
        .from('bottles')
        .insert({
          customer_id: customerId,
          bottle_name: bottleName,
          hostess,
          brand,
          last_visit: lastVisit,
          stock_type: stockType,
          stock_value: stockValue,
        })
  
    if (bottleError) {
      alert(bottleError.message)
      return
    }
  
    setShowNewCustomer(false)
  
    setCustomerName('')
    setBottleName('')
    setHostess('')
    setBrand('')
    setLastVisit('')
    setStockValue('')
  
    loadCustomers()
  }

  return (
    <main className="p-4 max-w-4xl mx-auto">

      <h1 className="text-3xl font-bold mb-5">
        検索・編集
      </h1>
      <button
  onClick={() =>
    setShowNewCustomer(true)
  }
  className="bg-green-700 text-white px-4 py-3 rounded-lg mb-4"
>
  新規顧客＋ボトル登録
</button>

{showNewCustomer && (
  <div className="border p-4 rounded bg-green-50 mb-4">

    <h3 className="font-bold mb-3 text-black">
      新規顧客＋ボトル登録
    </h3>

    <input
      value={customerName}
      onChange={(e) =>
        setCustomerName(e.target.value)
      }
      placeholder="顧客名"
      className="border p-2 w-full mb-2 text-black"
    />

    <input
      value={bottleName}
      onChange={(e) =>
        setBottleName(e.target.value)
      }
      placeholder="ボトル名"
      className="border p-2 w-full mb-2 text-black"
    />

    <input
      value={hostess}
      onChange={(e) =>
        setHostess(e.target.value)
      }
      placeholder="指名"
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

    <input
      type="date"
      value={lastVisit}
      onChange={(e) =>
        setLastVisit(e.target.value)
      }
      className="border p-2 w-full mb-2 text-black"
    />

    <select
      value={stockType}
      onChange={(e) =>
        setStockType(e.target.value)
      }
      className="border p-2 w-full mb-2 text-black"
    >
      <option value="gram">
        残量(g)
      </option>

      <option value="regularShelf">
        通常棚
      </option>

      <option value="vipShelf">
        常連棚
      </option>
    </select>

    {stockType === 'gram' && (
      <input
        value={stockValue}
        onChange={(e) =>
          setStockValue(e.target.value)
        }
        placeholder="残量(g)"
        className="border p-2 w-full mb-2 text-black"
      />
    )}

    <button
      onClick={addCustomerAndBottle}
      className="bg-green-600 text-white px-4 py-2 rounded"
    >
      登録
    </button>

  </div>
)}

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
            {selectedCustomer && (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">

    <div className="bg-white text-black w-full max-w-md rounded-xl p-5">

      <h2 className="text-xl font-bold mb-3">
        {selectedCustomer.customer_name}
      </h2>

      <button
        onClick={() => setSelectedCustomer(null)}
        className="bg-gray-500 text-white px-3 py-2 rounded mb-4"
      >
        閉じる
      </button>

      <h3 className="font-bold mb-3">
        登録ボトル
      </h3>
      <button
  onClick={() => setShowAddBottle(true)}
  className="bg-green-600 text-white px-4 py-2 rounded mb-3"
>
  ボトル追加
</button>

      {bottles.length === 0 && (
    
        <p>登録ボトルなし</p>
      )}
      {showAddBottle && (
  <div className="border p-4 rounded bg-green-50 mb-4">

    <h4 className="font-bold mb-3">
      ボトル追加
    </h4>

    <input
      value={bottleName}
      onChange={(e) =>
        setBottleName(e.target.value)
      }
      placeholder="ボトル名"
      className="border p-2 w-full mb-2"
    />

    <input
      value={hostess}
      onChange={(e) =>
        setHostess(e.target.value)
      }
      placeholder="指名"
      className="border p-2 w-full mb-2"
    />

    <input
      value={brand}
      onChange={(e) =>
        setBrand(e.target.value)
      }
      placeholder="銘柄"
      className="border p-2 w-full mb-2"
    />

    <input
      type="date"
      value={lastVisit}
      onChange={(e) =>
        setLastVisit(e.target.value)
      }
      className="border p-2 w-full mb-2"
    />
    <select
  value={stockType}
  onChange={(e) =>
    setStockType(e.target.value)
  }
  className="border p-2 w-full mb-2"
>
  <option value="gram">
    残量(g)
  </option>

  <option value="regularShelf">
    通常棚
  </option>

  <option value="vipShelf">
    常連棚
  </option>
</select>

{stockType === 'gram' && (
  <input
    value={stockValue}
    onChange={(e) =>
      setStockValue(e.target.value)
    }
    placeholder="残量(g)"
    className="border p-2 w-full mb-2"
  />
)}

    <button
      onClick={addBottle}
      className="bg-green-600 text-white px-3 py-2 rounded"
    >
      登録
    </button>

  </div>
)}

      {bottles.map((bottle) => (
        <div
          key={bottle.id}
          className="border rounded p-3 mb-2"
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
            {bottle.hostess}
          </div>

          <div>
            状態：
            {bottle.stock_type === 'gram'
  ? `${bottle.stock_value}g`
  : bottle.stock_type === 'vipShelf'
  ? '常連棚'
  : '通常棚'}
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
    className="bg-blue-600 text-white px-3 py-1 rounded"
  >
    編集
  </button>

  <button
    onClick={() => deleteBottle(bottle.id)}
    className="bg-red-600 text-white px-3 py-1 rounded"
  >
    削除
  </button>

</div>
        </div>
      ))}
      {editBottleId && (
  <div className="border p-4 rounded bg-blue-50 mt-3">

    <h4 className="font-bold mb-2 text-black">
      状態編集
    </h4>

    <select
      value={editStockType}
      onChange={(e) =>
        setEditStockType(e.target.value)
      }
      className="border p-2 mb-2 mr-2 text-black"
    >
    <option value="gram">
  残量(g)
</option>

<option value="regularShelf">
  通常棚
</option>

<option value="vipShelf">
  常連棚
</option>
    </select>

    {editStockType === 'gram' && (
  <input
    value={editStockValue}
    onChange={(e) =>
      setEditStockValue(e.target.value)
    }
    className="border p-2 mr-2 text-black"
  />
)}

    <button
      onClick={updateBottle}
      className="bg-green-600 text-white px-3 py-2 rounded"
    >
      保存
    </button>

  </div>
)}

    </div>

  </div>
)}

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

      

    </main>
  )
}