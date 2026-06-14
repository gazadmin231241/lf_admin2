import { existsSync, readFileSync } from 'node:fs'

import * as sandcastleBase from '@ai-hero/sandcastle'

type BaseClaudeCodeOptions = Parameters<typeof sandcastleBase.claudeCode>[1]
type BaseClaudeCodeProvider = ReturnType<typeof sandcastleBase.claudeCode>
type BaseClaudeEffort = NonNullable<BaseClaudeCodeOptions>['effort']

type ClaudeCodeOptions = Omit<NonNullable<BaseClaudeCodeOptions>, 'effort'> & {
  readonly effort?: BaseClaudeEffort | 'ultracode'
}

loadSandcastleEnv()

export const sandcastle = {
  ...sandcastleBase,
  claudeCode,
  claudeCodeOllama
}

function loadSandcastleEnv(): void {
  const envUrl = new URL('.env', import.meta.url)

  if (!existsSync(envUrl)) {
    return
  }

  for (const line of readFileSync(envUrl, 'utf8').split(/\r?\n/)) {
    const trimmed = line.trim()

    if (!trimmed || trimmed.startsWith('#')) {
      continue
    }

    const separatorIndex = trimmed.indexOf('=')

    if (separatorIndex === -1) {
      continue
    }

    const key = trimmed.slice(0, separatorIndex).trim()
    const value = unquoteEnvValue(trimmed.slice(separatorIndex + 1).trim())

    if (key && process.env[key] === undefined) {
      process.env[key] = value
    }
  }
}

function unquoteEnvValue(value: string): string {
  if (value.length < 2) {
    return value
  }

  const quote = value[0]
  const last = value[value.length - 1]

  return (quote === '"' || quote === "'") && last === quote ? value.slice(1, -1) : value
}

function shellEscape(value: string): string {
  return `'${value.replaceAll("'", "'\\''")}'`
}

function getOptionalEnvValue(key: string): Record<string, string> {
  const value = process.env[key]
  return value ? { [key]: value } : {}
}

function toBaseOptions(options: ClaudeCodeOptions | undefined): BaseClaudeCodeOptions {
  if (!options) {
    return undefined
  }

  const { effort, ...rest } = options
  return {
    ...rest,
    effort: effort === 'ultracode' ? 'xhigh' : effort
  }
}

function getPermissionFlag(
  options: ClaudeCodeOptions | undefined,
  dangerouslySkipPermissions: boolean
): string {
  if (options?.permissionMode) {
    return ` --permission-mode ${shellEscape(options.permissionMode)}`
  }

  return dangerouslySkipPermissions ? ' --dangerously-skip-permissions' : ''
}

function appendPermissionArgs(
  args: string[],
  options: ClaudeCodeOptions | undefined,
  dangerouslySkipPermissions: boolean
): void {
  if (options?.permissionMode) {
    args.push('--permission-mode', options.permissionMode)
  } else if (dangerouslySkipPermissions) {
    args.push('--dangerously-skip-permissions')
  }
}

function getEffortFlag(options: ClaudeCodeOptions | undefined): string {
  if (!options?.effort) {
    return ''
  }

  return options.effort === 'ultracode'
    ? ` --settings ${shellEscape(JSON.stringify({ ultracode: true }))}`
    : ` --effort ${shellEscape(options.effort)}`
}

function appendEffortArgs(args: string[], options: ClaudeCodeOptions | undefined): void {
  if (!options?.effort) {
    return
  }

  if (options.effort === 'ultracode') {
    args.push('--settings', JSON.stringify({ ultracode: true }))
    return
  }

  args.push('--effort', options.effort)
}

function claudeCode(model: string, options?: ClaudeCodeOptions): BaseClaudeCodeProvider {
  const baseProvider = sandcastleBase.claudeCode(model, toBaseOptions(options))

  return {
    ...baseProvider,
    buildPrintCommand({ prompt, dangerouslySkipPermissions, resumeSession, forkSession }) {
      const permissionFlag = getPermissionFlag(options, dangerouslySkipPermissions)
      const effortFlag = getEffortFlag(options)
      const resumeFlag = resumeSession ? ` --resume ${shellEscape(resumeSession)}` : ''
      const forkFlag = resumeSession && forkSession ? ' --fork-session' : ''

      return {
        command:
          `claude --print --verbose${permissionFlag}` +
          ` --output-format stream-json --model ${shellEscape(model)}` +
          `${effortFlag}${resumeFlag}${forkFlag} -p -`,
        stdin: prompt
      }
    },
    buildInteractiveArgs({ prompt, dangerouslySkipPermissions }) {
      const args = ['claude']

      appendPermissionArgs(args, options, dangerouslySkipPermissions)
      args.push('--model', model)
      appendEffortArgs(args, options)

      if (prompt) {
        args.push(prompt)
      }

      return args
    }
  }
}

function claudeCodeOllama(model: string, options?: ClaudeCodeOptions): BaseClaudeCodeProvider {
  const baseProvider = sandcastleBase.claudeCode(model, toBaseOptions(options))
  const env = {
    ...baseProvider.env,
    ...getOptionalEnvValue('OLLAMA_API_KEY'),
    ...options?.env
  }

  return {
    ...baseProvider,
    name: 'claude-code-ollama',
    env,
    buildPrintCommand({ prompt, dangerouslySkipPermissions, resumeSession, forkSession }) {
      const permissionFlag = getPermissionFlag(options, dangerouslySkipPermissions)
      const effortFlag = getEffortFlag(options)
      const resumeFlag = resumeSession ? ` --resume ${shellEscape(resumeSession)}` : ''
      const forkFlag = resumeSession && forkSession ? ' --fork-session' : ''

      return {
        command:
          `ollama launch claude --yes --model ${shellEscape(model)} --` +
          ` --print --verbose${permissionFlag}` +
          ` --output-format stream-json${effortFlag}${resumeFlag}${forkFlag} -p -`,
        stdin: prompt
      }
    },
    buildInteractiveArgs({ prompt, dangerouslySkipPermissions }) {
      const args = ['ollama', 'launch', 'claude', '--yes', '--model', model]
      const claudeArgs: string[] = []

      appendPermissionArgs(claudeArgs, options, dangerouslySkipPermissions)
      appendEffortArgs(claudeArgs, options)

      if (prompt) {
        claudeArgs.push(prompt)
      }

      if (claudeArgs.length > 0) {
        args.push('--', ...claudeArgs)
      }

      return args
    }
  }
}
