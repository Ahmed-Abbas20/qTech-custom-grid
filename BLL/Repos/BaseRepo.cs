using DAL.Data;
using DAL.IRepos;
using DAL.Models;
using System.Linq.Expressions;

namespace BLL.Repos
{
 
    public class BaseRepo<T> : IBaseRepo<T> where T : class
    {
        protected readonly JsonDataService _dataService;


        public BaseRepo(JsonDataService dataService)
        {
            _dataService = dataService;
        }

        public virtual async Task<IEnumerable<T>> GetAllAsync()
        {
            var data = await _dataService.ReadDataAsync();
            
            if (typeof(T) == typeof(Bank))
                return (IEnumerable<T>)data.Banks;
            else if (typeof(T) == typeof(MaritalStatus))
                return (IEnumerable<T>)data.MaritalStatuses;
            else if (typeof(T) == typeof(User))
                return (IEnumerable<T>)data.Users;
            
            return new List<T>();
        }


        public virtual async Task<T?> GetByIdAsync(int id)
        {
            var entities = await GetAllAsync();
            return entities.FirstOrDefault(e => GetEntityId(e) == id);
        }


        public virtual async Task<IEnumerable<T>> FindAsync(Expression<Func<T, bool>> predicate)
        {
            var entities = await GetAllAsync();
            return entities.Where(predicate.Compile());
        }


        public virtual async Task<T?> FirstOrDefaultAsync(Expression<Func<T, bool>> predicate)
        {
            var entities = await GetAllAsync();
            return entities.FirstOrDefault(predicate.Compile());
        }


        public virtual async Task<T> AddAsync(T entity)
        {
            var data = await _dataService.ReadDataAsync();
            
            if (typeof(T) == typeof(Bank) && entity is Bank bank)
            {
                bank.Id = data.Banks.Any() ? data.Banks.Max(b => b.Id) + 1 : 1;
                bank.CreatedAt = DateTime.Now;
                data.Banks.Add(bank);
            }
            else if (typeof(T) == typeof(MaritalStatus) && entity is MaritalStatus maritalStatus)
            {
                maritalStatus.Id = data.MaritalStatuses.Any() ? data.MaritalStatuses.Max(m => m.Id) + 1 : 1;
                maritalStatus.CreatedAt = DateTime.Now;
                data.MaritalStatuses.Add(maritalStatus);
            }
            else if (typeof(T) == typeof(User) && entity is User user)
            {
                user.Id = data.Users.Any() ? data.Users.Max(u => u.Id) + 1 : 1;
                user.CreatedAt = DateTime.Now;
                user.UpdatedAt = DateTime.Now;
                data.Users.Add(user);
            }
            
            await _dataService.WriteDataAsync(data);
            return entity;
        }


        public virtual async Task AddRangeAsync(IEnumerable<T> entities)
        {
            foreach (var entity in entities)
            {
                await AddAsync(entity);
            }
        }

        public virtual async void Update(T entity)
        {
            await UpdateAsync(entity);
        }


        public virtual async Task UpdateAsync(T entity)
        {
            var data = await _dataService.ReadDataAsync();
            var entityId = GetEntityId(entity);
            
            if (typeof(T) == typeof(Bank) && entity is Bank bank)
            {
                var existingBank = data.Banks.FirstOrDefault(b => b.Id == entityId);
                if (existingBank != null)
                {
                    var index = data.Banks.IndexOf(existingBank);
                    bank.CreatedAt = existingBank.CreatedAt;
                    data.Banks[index] = bank;
                }
            }
            else if (typeof(T) == typeof(MaritalStatus) && entity is MaritalStatus maritalStatus)
            {
                var existingStatus = data.MaritalStatuses.FirstOrDefault(m => m.Id == entityId);
                if (existingStatus != null)
                {
                    var index = data.MaritalStatuses.IndexOf(existingStatus);
                    maritalStatus.CreatedAt = existingStatus.CreatedAt;
                    data.MaritalStatuses[index] = maritalStatus;
                }
            }
            else if (typeof(T) == typeof(User) && entity is User user)
            {
                var existingUser = data.Users.FirstOrDefault(u => u.Id == entityId);
                if (existingUser != null)
                {
                    var index = data.Users.IndexOf(existingUser);
                    user.CreatedAt = existingUser.CreatedAt;
                    user.UpdatedAt = DateTime.Now;
                    data.Users[index] = user;
                }
            }
            
            await _dataService.WriteDataAsync(data);
        }

        public virtual async void UpdateRange(IEnumerable<T> entities)
        {
            foreach (var entity in entities)
            {
                await UpdateAsync(entity);
            }
        }

        public virtual async void Delete(T entity)
        {
            var entityId = GetEntityId(entity);
            await DeleteByIdAsync(entityId);
        }


        public virtual async Task DeleteByIdAsync(int id)
        {
            System.Diagnostics.Debug.WriteLine($"DeleteByIdAsync called for type {typeof(T).Name} with ID: {id}");
            
            var data = await _dataService.ReadDataAsync();
            System.Diagnostics.Debug.WriteLine($"Current users count before delete: {data.Users.Count}");
            
            if (typeof(T) == typeof(Bank))
            {
                var bank = data.Banks.FirstOrDefault(b => b.Id == id);
                if (bank != null)
                {
                    System.Diagnostics.Debug.WriteLine($"Removing bank with ID: {id}");
                    data.Banks.Remove(bank);
                    await _dataService.WriteDataAsync(data);
                    System.Diagnostics.Debug.WriteLine("Bank removed successfully");
                }
                else
                {
                    System.Diagnostics.Debug.WriteLine($"Bank with ID {id} not found");
                }
            }
            else if (typeof(T) == typeof(MaritalStatus))
            {
                var maritalStatus = data.MaritalStatuses.FirstOrDefault(m => m.Id == id);
                if (maritalStatus != null)
                {
                    System.Diagnostics.Debug.WriteLine($"Removing marital status with ID: {id}");
                    data.MaritalStatuses.Remove(maritalStatus);
                    await _dataService.WriteDataAsync(data);
                    System.Diagnostics.Debug.WriteLine("Marital status removed successfully");
                }
                else
                {
                    System.Diagnostics.Debug.WriteLine($"Marital status with ID {id} not found");
                }
            }
            else if (typeof(T) == typeof(User))
            {
                var user = data.Users.FirstOrDefault(u => u.Id == id);
                if (user != null)
                {
                    System.Diagnostics.Debug.WriteLine($"Removing user with ID: {id}, Name: {user.FirstName} {user.FamilyName}");
                    data.Users.Remove(user);
                    await _dataService.WriteDataAsync(data);
                    System.Diagnostics.Debug.WriteLine($"User removed successfully. New users count: {data.Users.Count}");
                }
                else
                {
                    System.Diagnostics.Debug.WriteLine($"User with ID {id} not found");
                }
            }
        }


        public virtual async void DeleteRange(IEnumerable<T> entities)
        {
            foreach (var entity in entities)
            {
                var entityId = GetEntityId(entity);
                await DeleteByIdAsync(entityId);
            }
        }


        public virtual async Task<bool> ExistsAsync(Expression<Func<T, bool>> predicate)
        {
            var entities = await GetAllAsync();
            return entities.Any(predicate.Compile());
        }


        public virtual async Task<int> CountAsync(Expression<Func<T, bool>> predicate)
        {
            var entities = await GetAllAsync();
            return entities.Count(predicate.Compile());
        }

  
        public virtual async Task<IEnumerable<T>> GetPagedAsync(int pageNumber, int pageSize, Expression<Func<T, bool>>? predicate = null)
        {
            var entities = await GetAllAsync();
            var query = entities.AsQueryable();
            
            if (predicate != null)
            {
                query = query.Where(predicate.Compile()).AsQueryable();
            }

            return query
                .Skip((pageNumber - 1) * pageSize)
                .Take(pageSize)
                .ToList();
        }


        private int GetEntityId(T entity)
        {
            var idProperty = typeof(T).GetProperty("Id");
            if (idProperty != null && idProperty.PropertyType == typeof(int))
            {
                return (int)idProperty.GetValue(entity)!;
            }
            return 0;
        }
    }
}
