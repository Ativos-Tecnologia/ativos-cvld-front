## Base de montagem para a view "Realizar 1º Contato":

{
	
	"and": 
	[
			{
				"property": "Usuário",
				"multi_select": {
						"contains": "jarbas"
				}
			},
			{
			"or":
				[
					{
							"property": "Status",
							"status": {
									"equals": "Realizar Primeiro Contato"
								}
					},
					{
						"property": "Status",
						"status": {
								"equals": "1º Contato não alcançado"
							}
					},
					{
						"property": "Status",
						"status": {
								"equals": "2º Contato não alcançado"
							}
					},
					{
						"property": "Status",
						"status": {
								"equals": "3º Contato não alcançado"
							}
					}
				]
			}
	]
}

## Base de montagem para a view "Juntar Ofício/Valor Líquido":

{
	
	"and": 
	[
			{
				"property": "Usuário",
				"multi_select": {
						"contains": "jarbas"
				}
			},
			{
			"or":
				[
					{
							"property": "Status",
							"status": {
									"equals": "Juntar Ofício ou Memória de Cálculo"
								}
					},
					{
						"property": "Status",
						"status": {
								"equals": "Calcular Valor Líquido"
							}
					}
				]
			}
	]
}

## Enviar Proposta/Negociação

{
	
	"and": 
	[
			{
				"property": "Usuário",
				"multi_select": {
						"contains": "jarbas"
				}
			},
			{
			"or":
				[
					{
							"property": "Status",
							"status": {
									"equals": "Enviar proposta"
								}
					},
				]
			}
	]
}

## Proposta Aceita

{
	
	"and": 
	[
			{
				"property": "Usuário",
				"multi_select": {
						"contains": "jarbas"
				}
			},
			{
			"or":
				[
					{
							"property": "Status",
							"status": {
									"equals": "Proposta aceita"
								}
					}
				]
			}
	]
}