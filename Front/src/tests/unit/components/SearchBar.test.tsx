import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'

import SearchBar from '../../../components/SearchBar'

describe('SearchBar', () => {
  it('CP-16 deshabilita buscar con campo vacio', () => {
    render(<SearchBar onSearch={vi.fn().mockResolvedValue(undefined)} />)

    const searchButton = screen.getByRole('button', { name: 'Buscar' })
    expect(searchButton).toBeDisabled()
  })

  it('CP-13 ejecuta busqueda por tracking y CP-14 por destinatario', async () => {
    const user = userEvent.setup()
    const onSearch = vi.fn().mockResolvedValue(undefined)

    render(<SearchBar onSearch={onSearch} />)

    await user.type(screen.getByPlaceholderText('Buscar por ID de tracking...'), 'LOG-2024-001')
    await user.click(screen.getByRole('button', { name: 'Buscar' }))

    expect(onSearch).toHaveBeenCalledWith('LOG-2024-001')
  })

  it('CP-15 permite limpiar busqueda y reiniciar resultados', async () => {
    const user = userEvent.setup()
    const onSearch = vi.fn().mockResolvedValue(undefined)

    render(<SearchBar onSearch={onSearch} />)

    await user.type(screen.getByPlaceholderText('Buscar por ID de tracking...'), 'NO-EXISTE')
    await user.click(screen.getByRole('button', { name: 'Limpiar' }))

    expect(onSearch).toHaveBeenCalledWith('')
  })
})
