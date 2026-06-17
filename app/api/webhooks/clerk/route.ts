// app/api/webhooks/clerk/route.ts
import { Webhook } from 'svix'
import { headers } from 'next/headers'
import { WebhookEvent } from '@clerk/nextjs/server'
import { createClient } from '@supabase/supabase-js'

const supabaseProduct = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: Request) {

  const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET

  if (!WEBHOOK_SECRET) {
    throw new Error('Por favor, adicione o WEBHOOK_SECRET nas suas variáveis de ambiente.')
  }


  const headerPayload = await headers()
  const svix_id = headerPayload.get('svix-id')
  const svix_timestamp = headerPayload.get('svix-timestamp')
  const svix_signature = headerPayload.get('svix-signature')

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response('Erro: Cabeçalhos Svix ausentes', { status: 400 })
  }


  const payload = await req.json()
  const body = JSON.stringify(payload)

  const wh = new Webhook(WEBHOOK_SECRET)
  let evt: WebhookEvent

  try {
    evt = wh.verify(body, {
      'svix-id': svix_id,
      'svix-timestamp': svix_timestamp,
      'svix-signature': svix_signature,
    }) as WebhookEvent
  } catch (err) {
    console.error('Erro ao verificar o webhook:', err)
    return new Response('Erro: Verificação falhou', { status: 400 })
  }

  const eventType = evt.type



    if (eventType === "user.created") {
        const { id, unsafe_metadata } = evt.data

        const browserLanguageCode = (unsafe_metadata?.language as string) || 'pt-BR'

        const { data: languageData, error: languageError } = await supabaseProduct
            .from('languages') // Nome exato da sua tabela de idiomas
            .select('id')
            .eq('code', browserLanguageCode) // 'code' deve ser a coluna onde fica 'pt-BR', 'en-US'
            .single()

        const finalLanguageId = languageData?.id || 1

        const { error } = await supabaseProduct
        .from('users') 
        .insert({
            id: id,       
            language_id: finalLanguageId,
            created_at: new Date().toISOString()
        })

        if (error) {
            console.error('Erro ao inserir perfil no Supabase:', error)
            return new Response('Erro ao salvar no banco de dados', { status: 500 })
        }

        const defaultCategories = [
          { user_id: id, category: 'Alimentação', type: 'expense' },
          { user_id: id, category: 'Transporte', type: 'expense' },
          { user_id: id, category: 'Lazer', type: 'expense' },
          { user_id: id, category: 'Salário', type: 'income' },
          { user_id: id, category: 'Investimentos', type: 'income' },
          { user_id: id, category: 'Renda extra', type: 'income' },
        ]

        const { error: categoryError } = await supabaseProduct
          .from('category')
          .insert(defaultCategories)
          
        if (categoryError) {
          console.error('Erro ao inserir categorias padrão:', categoryError)
        }

        const defaultMethod = [
          { user_id: id, method: 'Cartão de crédito', type: 'expense' },
          { user_id: id, method: 'Transporte', type: 'expense' },
          { user_id: id, method: 'Lazer', type: 'expense' },
          { user_id: id, method: 'Pix', type: 'income' },
          { user_id: id, method: 'TED', type: 'income' },
        ]

        const { error: methodError } = await supabaseProduct
          .from('method')
          .insert(defaultMethod)
          
        if (methodError) {
          console.error('Erro ao inserir métodos padrão:', methodError)
        }

        return new Response('Usuário sincronizado com sucesso!', { status: 201 })
    }

  return new Response('Webhook recebido', { status: 200 })
}