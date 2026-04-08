import numpy as np
def hill_curve(concentrations, K=50, n=2):
    c=np.array(concentrations,dtype=float)
    return (np.power(c,n)/(np.power(K,n)+np.power(c,n))).tolist()
