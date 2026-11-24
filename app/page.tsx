'use client'

import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

type Customer = {
  id: number
  customer_id: string
  customer_name: string
  hostess: string | null
}

export default function Home() {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [searchText, setSearchText] = useState('')
  const [selectedCustomer, setSelectedCustomer] =
    useState<Customer | null>(null)
    const [showHostessEdit, setShowHostessEdit] =
  useState(false)
  const [showAddBottle, setShowAddBottle] =
  useState(false)
  const [bottleName, setBottleName] =
  useState('')
  const [editBottleId, setEditBottleId] =
  useState<number | null>(null)

const [editStockType, setEditStockType] =
  useState('gram')

const [editStockValue, setEditStockValue] =
  useState('')

const [brand, setBrand] =
  useState('')

const [stockType, setStockType] =
  useState('gram')

const [stockValue, setStockValue] =
  useState('')

const [editHostess, setEditHostess] =
  useState('')
    const [bottles, setBottles] = useState<any[]>([])
    useEffect(() => {
      loadCustomers()
    }, [])
    
    async function loadCustomers() {

      alert(
        `URL=${process.env.NEXT_PUBLIC_SUPABASE_URL}
    
    KEY=${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.substring(0, 20)}`
      )
    
      const { data, error } = await supabase
        .from('customers')
        .select('*')
        .order('customer_id')
    
      alert(
        `data=${data?.length || 0}
    
    error=${error?.message || 'なし'}`
      )
    
      setCustomers(data || [])
    }
    
    
    async function loadBottles(customerId: string) {
      const { data } = await supabase
        .from('bottles')
        .select('*')
        .eq('customer_id', customerId)
    
      setBottles(data || [])
    }
    async function updateBottle() {
      if (!editBottleId) return
    
      const { error } = await supabase
        .from('bottles')
        .update({
          stock_type: editStockType,
          stock_value:
            editStockType === 'gram'
              ? editStockValue
              : null,
        })
        .eq('id', editBottleId)
    
      if (error) {
        alert(error.message)
        return
      }
    
      if (selectedCustomer) {
        loadBottles(
          selectedCustomer.customer_id
        )
      }
    
      setEditBottleId(null)
    
      alert('更新しました')
    }
    async function addBottle() {
      if (!selectedCustomer) return
    
      const { error } = await supabase
        .from('bottles')
        .insert({
          customer_id:
            selectedCustomer.customer_id,
          bottle_name: bottleName,
          brand,
          stock_type: stockType,
          stock_value:
            stockType === 'gram'
              ? stockValue
              : null,
        })
    
      if (error) {
        alert(error.message)
        return
      }
    
      setBottleName('')
      setBrand('')
      setStockValue('')
    
      setShowAddBottle(false)
    
      loadBottles(
        selectedCustomer.customer_id
      )
    
      alert('登録完了')
    }
    
    async function updateHostess() {
      if (!selectedCustomer) return
    
      const { error } = await supabase
        .from('customers')
        .update({
          hostess: editHostess,
        })
        .eq('id', selectedCustomer.id)
        console.log(error)
    
      if (error) {
        alert(error.message)
        return
      }
    
      await loadCustomers()
    
      setSelectedCustomer({
        ...selectedCustomer,
        hostess: editHostess,
      })
    
      setShowHostessEdit(false)
    
      alert('担当ホステスを更新しました')
    }
  
    async function deleteBottle(id: number) {
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
    
      if (selectedCustomer) {
        loadBottles(
          selectedCustomer.customer_id
        )
      }
    
      alert('削除しました')
    }

  return (
    <main className="p-4 max-w-4xl mx-auto">

      <h1 className="text-3xl font-bold mb-5">
        キープボトル管理
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
        .filter(
          (customer) =>
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

            <div className="font-bold text-lg">
              {customer.customer_name}
            </div>

            <div className="text-sm text-gray-500">
              顧客番号：
              {customer.customer_id}
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
<div className="bg-white text-black w-full max-w-md rounded-xl p-5 max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-3">
              {selectedCustomer.customer_name}
            </h2>


            <h2 className="text-xl font-bold mb-3">
  {selectedCustomer.customer_name}
</h2>

<div className="flex items-center gap-2 mb-3">

  <span>
    担当ホステス：
    {selectedCustomer.hostess || '未登録'}
  </span>

  <button
    onClick={() => {
      setEditHostess(
        selectedCustomer?.hostess || ''
      )
      setShowHostessEdit(true)
    }}
    className="bg-blue-600 text-white px-2 py-1 rounded text-sm"
  >
    指名変更
  </button>

</div>

{showHostessEdit && (
  <div className="border p-3 rounded mt-2 mb-3 bg-blue-50">

    <p className="font-bold mb-2">
      担当ホステス変更
    </p>

    <input
      value={editHostess}
      onChange={(e) =>
        setEditHostess(e.target.value)
      }
      className="border p-2 w-full mb-2 text-black"
    />

    <div className="flex gap-2">

      <button
        onClick={updateHostess}
        className="bg-green-600 text-white px-3 py-2 rounded"
      >
        保存
      </button>

      <button
        onClick={() =>
          setShowHostessEdit(false)
        }
        className="bg-gray-500 text-white px-3 py-2 rounded"
      >
        キャンセル
      </button>

    </div>

  </div>
)}

            <p className="mb-4">
              顧客番号：
              {selectedCustomer.customer_id}
            </p>

            <button
  onClick={() =>
    setShowAddBottle(true)
  }
  className="bg-green-600 text-white px-4 py-2 rounded mb-4"
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

<div className="flex gap-2">

<button
  onClick={addBottle}
  className="bg-green-600 text-white px-4 py-2 rounded"
>
  登録
</button>

<button
  onClick={() =>
    setShowAddBottle(false)
  }
  className="bg-gray-500 text-white px-4 py-2 rounded"
>
  キャンセル
</button>

</div>

  </div>
)}

<hr className="my-4" />

<p>
  ボトル件数：
  {bottles.length}
</p>

<h3 className="font-bold text-lg mb-3">
  登録ボトル
</h3>
{bottles.length === 0 ? (
  <p>登録ボトルなし</p>
) : (
  bottles.map((bottle) => (

    <div
      key={bottle.id}
      className="mb-3"
    >
  
      <div className="border rounded p-3">
  
        <div className="font-bold">
          {bottle.bottle_name}
        </div>
  
        <div>
          銘柄：
          {bottle.brand}
        </div>
  
        <div>
          状態：
          {bottle.stock_type === 'gram'
            ? `${bottle.stock_value}g`
            : bottle.stock_type === 'vipShelf'
            ? '常連棚'
            : '通常棚'}
        </div>
  
        <div>
          最終編集日：
          {bottle.updated_at?.slice(0, 10)}
        </div>
  
        <div className="flex gap-2 mt-2">
  
          <button
            onClick={() => {
              setEditBottleId(bottle.id)
  
              setEditStockType(
                bottle.stock_type || 'gram'
              )
  
              setEditStockValue(
                bottle.stock_value || ''
              )
            }}
            className="bg-blue-600 text-white px-3 py-1 rounded"
          >
            編集
          </button>
  
          <button
            onClick={() =>
              deleteBottle(bottle.id)
            }
            className="bg-red-600 text-white px-3 py-1 rounded"
          >
            削除
          </button>
  
        </div>
  
      </div>
  
      {editBottleId === bottle.id && (
  
        <div className="border p-3 rounded mt-2 bg-blue-50">
  
          <h4 className="font-bold mb-2">
            状態編集
          </h4>
  
          <select
            value={editStockType}
            onChange={(e) =>
              setEditStockType(e.target.value)
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
  
          {editStockType === 'gram' && (
            <input
              value={editStockValue}
              onChange={(e) =>
                setEditStockValue(
                  e.target.value
                )
              }
              placeholder="残量(g)"
              className="border p-2 w-full mb-2 text-black"
            />
          )}
  
          <button
            onClick={updateBottle}
            className="bg-green-600 text-white px-4 py-2 rounded"
          >
            保存
          </button>
  
        </div>
  
      )}
  
    </div>
  
  ))

)}




<button
  onClick={() => setSelectedCustomer(null)}
  className="bg-gray-500 text-white px-3 py-2 rounded"
>
  閉じる
</button>

          </div>
        </div>
      )}
      

    </main>
  )
}