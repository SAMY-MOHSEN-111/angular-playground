import {finalize, merge, Observable, retry, Subject, switchMap, timer} from 'rxjs';
import {computed, DestroyRef, inject, Signal, signal, WritableSignal} from '@angular/core';
import {takeUntilDestroyed, toObservable} from '@angular/core/rxjs-interop';

type ResourceLoader<T, R> = (params: R) => Observable<T>;

interface RetryOptions {
  maxRetry?: number;
  delayMs?: number;
  resetOnSuccess?: boolean;
  onRetry?: (attempt: number, error: any) => void;
}

interface SmartHttpResourceOptions<T, R> {
  params: Signal<R> | (() => R);
  loader: ResourceLoader<T, R>;
  retryOptions?: RetryOptions;
}

interface SmartHttpResource<T> {
  reload: () => void;
  set: (newValue: T) => void;
  isLoading: Signal<boolean>;
  value: WritableSignal<T | null>;
  error: Signal<unknown | null>;
  update: (updateFn: (currentValue: (T | null)) => T) => void;
}

function retryHttp<T>(options: RetryOptions = {}) {
  const {maxRetry = 0, delayMs = 1000, resetOnSuccess = false, onRetry} = options;
  return (source: Observable<T>) =>
    source.pipe(
      retry({
        count: maxRetry,
        delay: (err, retryCount) => {
          onRetry?.(retryCount, err);
          return timer(delayMs);
        },
        resetOnSuccess,
      })
    );
}

export function smartHttpResource<T, R>(options: SmartHttpResourceOptions<T, R>): SmartHttpResource<T> {
  const destroyRef = inject(DestroyRef);
  const isLoading = signal(false);
  const error = signal<unknown | null>(null);
  const value = signal<T | null>(null);

  const reload$ = new Subject<void>();
  const set = (newValue: T) => value.set(newValue);
  const update = (updateFn: (currentValue: T | null) => T) => value.set(updateFn(value()));

  const paramsSignal: Signal<R> =
    typeof options.params === 'function'
      ? computed(options.params)
      : options.params;

  const params$ = toObservable(paramsSignal);

  const resource$ = merge(params$, reload$)
    .pipe(
      switchMap(() => {
        isLoading.set(true);
        error.set(null);
        return options.loader(paramsSignal())
          .pipe(
            retryHttp(options.retryOptions),
            finalize(() => isLoading.set(false)),
            takeUntilDestroyed(destroyRef),
          );
      })
    );

  resource$.subscribe({
    next: (v) => value.set(v),
    error: (err) => error.set(err)
  });

  return {
    value,
    isLoading,
    error,
    reload: () => reload$.next(),
    set,
    update,
  };
}
